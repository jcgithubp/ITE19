import { useState } from 'react';
import supabase from './SupabaseClient.js';
import UserNavbar from './UserNavbar.js';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, FloatingLabel } from 'react-bootstrap';

function BuyNow(){
    const [error, setError] = useState(null);
    const [carColor, setCarColor] = useState('Red');
    const [carEngine, setCarEngine] = useState('Diesel');
    const [transmissionType, setTransmissionType] = useState('Automatic');
    const navigate = useNavigate();

    const user_name = localStorage.getItem('user_name');
    const car_name = localStorage.getItem('car_name');
    const car_style = localStorage.getItem('car_style');
    const car_price = localStorage.getItem('price');
    const image_path = localStorage.getItem('image_path');
    const VIN = localStorage.getItem('VIN');
    const dealer_name = localStorage.getItem('dealer_name');

    const deduct = async () => {
        const car_name = localStorage.getItem('car_name');
        const { data } = await supabase
        .from('dealer_inventory')
        .select('*')
        .eq('car_name', car_name)
        .single();

        console.log(data);
        const newstocks = data.stocks;
        console.log(newstocks);
        localStorage.setItem('newstocks', newstocks);

        try {
          const deductedstocks = localStorage.getItem('newstocks')
          console.log(deductedstocks);
          let newStocks = parseInt(deductedstocks) - 1;
          console.log(newStocks );
            const { data } = await supabase
            .from('dealer_inventory')
            .update({ 'stocks': newStocks })    
            .eq('car_name', car_name);
            console.log(data);
            buyconfirm();
        } 
        catch(error) {
            console.error('Error during login:', error.message); 
        }
    }

    const buyconfirm = async () => {
        try {
            const { data } = await supabase
            .from('user_purchase')
            .insert([
                {
                    user_name,
                    car_name,
                    car_style,
                    car_price,
                    image_path,
                    car_color: carColor,
                    car_engine: carEngine,
                    transmission_type: transmissionType,
                    VIN,
                },
            ])
            .select();
    
            console.log(data);
            alert('Order Successful');
            dealersales();
            navigate('/userpurchase');
        } 
        catch (error) {
          console.error('Error during login:', error.message);
          setError(error.message);
        }
    };

    const dealersales = async () => {
        try {
            const { data } = await supabase
            .from('dealer_sales')
            .insert([
                {
                    dealer_name,
                    user_name,
                    car_name,
                    car_style,
                    car_price,
                    image_path,
                    car_color: carColor,
                    car_engine: carEngine,
                    transmission_type: transmissionType,
                    VIN,
                },
            ])
            .select();
    
            console.log(data);
        } 
        catch (error) {
          console.error('Error during login:', error.message);
          setError(error.message);
        }
    };

    return(
        <>
            <UserNavbar />
            <Container className='mt-5 d-flex justify-content-center'>
                <Card style={{ 
                    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                    padding: '20px 20px',
                    width: '30rem'
                }}>
                    <Card.Img src={image_path} variant="top" />
                        <Card.Title className="mt-3">Brand name: {car_name}</Card.Title>
                        <Card.Title className="mt-1">Brand price: {car_price}</Card.Title><br/>
                        <Card.Text>
                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="floatingSelectGrid"
                                        label="Car color : "
                                    >
                                        <Form.Select value={carColor} onChange={(e) => setCarColor(e.target.value)} aria-label="Floating label select example">
                                            <option value="Red">Red</option>
                                            <option value="Black">Black</option>
                                            <option value="White">White</option>
                                            <option value="Pink">Pink</option>
                                            <option value="Purple">Purple</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="floatingSelectGrid"
                                        label="Transmission type : "
                                    >
                                        <Form.Select value={transmissionType} onChange={(e) => setTransmissionType(e.target.value)} aria-label="Floating label select example">
                                            <option value="Automatic">Automatic</option>
                                            <option value="Manual">Manual</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>

                                <Row>
                                    <Col>
                                        <FloatingLabel
                                            className="mt-3"
                                            controlId="floatingSelectGrid"
                                            label="Car Engine : "
                                        >
                                            <Form.Select value={carEngine} onChange={(e) => setCarEngine(e.target.value)} aria-label="Floating label select example">
                                                <option value="Gasoline">Gasoline</option>
                                                <option value="Diesel">Diesel</option>
                                                <option value="4-Cylinder">4-Cylinder</option>
                                                <option value="Petrol">Petrol</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Row>
                        </Card.Text>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button 
                                style={{
                                            backgroundColor: "#12bca2",
                                            height: "55px",
                                            borderColor: "none !important"
                                          }} 
                                className="check-out w-50"
                                onClick={deduct}

                            >
                                Buy Now
                            </Button>
                        </div>
                        {error && <p>{error}</p>}
                </Card>
            </Container>
        </>
    );
}

export default BuyNow;