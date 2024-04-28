import supabase from './SupabaseClient.js';
import { useState, useEffect, useCallback } from 'react';
import DealerNavbar from "./DealerNavbar";
import { useNavigate } from 'react-router-dom';

const DealerConfirm = () =>  {
    const [error] = useState(null);
    const navigate = useNavigate();

    const deduct = useCallback(async (car_name) => {
        const { data } = await supabase
        .from('cars')
        .select('*')
        .eq('car_name', car_name)
        .single();

        console.log(data);
        const newstocks = data.stocks;
        console.log(newstocks);
        localStorage.setItem('newstocks', newstocks);

        try {
          const deductedstocks = localStorage.getItem('newstocks')
          let newStocks = parseInt(deductedstocks) - 1;
          console.log(newStocks);
            const { data } = await supabase
            .from('cars')
            .update({ 'stocks': newStocks })    
            .eq('car_name', car_name);
            console.log(data);
            alert('Purchase Successful');
            navigate('/dealerinventory');
        } 
        catch(error) {
            console.error('Error during login:', error.message); 
        }
    }, [navigate]); 

    const store1 = useCallback(async (car_name) => {
        const stocks = localStorage.getItem('stocks');
        let newStocks = parseInt(stocks) + 1;
        try {
            const { data } = await supabase
            .from('dealer_inventory')
            .update({ 'stocks': newStocks })    
            .eq('car_name', car_name);
            console.log(data);
            deduct(car_name);
        } 
        catch(error) {
            console.error('Error during login:', error.message);  
        }
    }, [deduct]); 

    const store2 = useCallback(async () => {
        const dealer_name = localStorage.getItem('dealer_name');
        const car_name = localStorage.getItem('car_name');
        const car_style = localStorage.getItem('car_style');
        const price = localStorage.getItem('price');
        const vin = localStorage.getItem('VIN');
        const image_path = localStorage.getItem('image_path');

        try {
            const { data } = await supabase
            .from('dealer_inventory')
            .insert([
                {
                    dealer_name,
                    car_name,
                    car_style,
                    price,
                    VIN: vin,
                    image_path,
                    stocks:'1'
                },
            ])
            .select()
            console.log(data);
            deduct(car_name);


            //alert("Ordered Successfully")
            //navigate('/dealerhome');
        } 
        catch (error) {
            console.error('Error during login:', error.message);
        }
    }, [navigate, deduct]);

    const buyConfirm = useCallback(async () => {
        const car_name = localStorage.getItem('car_name');
        try {
            const { data } = await supabase
            .from('dealer_inventory')
            .select('*')
            .eq('car_name', car_name)
            .single();
            console.log(data);
                     
            if (data && data.car_name === car_name) {
                const stocks = data.stocks;
                localStorage.setItem('stocks', stocks);
                store1(car_name);
            } else {
                store2();
            }
        } 
        catch(error) {
            console.error('Error fetching data:', error.message);
        }
    }, [store1, store2]);

    useEffect(() => {
        buyConfirm();
    }, [buyConfirm]); 

    return (
        <div>
            <DealerNavbar />
            <div>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}
  
export default DealerConfirm;
