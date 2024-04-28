import './app.css';
import DealerNavbar from "./DealerNavbar";
import { Col, Row, Card, Container, Form} from "react-bootstrap";
import { useState, useEffect, useCallback } from 'react';
import supabase from './SupabaseClient.js';

function DealerInventory(){
    const [searchTerm, setSearchTerm] = useState("");
    const [carData, setCarData] = useState(null);
    const [error] = useState(null);
    const dealerName = localStorage.getItem('dealer_name');

    const handleInventory = useCallback(async () => {
        try{
            const { data } = await supabase
            .from('dealer_inventory')
            .select('*') 
            .eq('dealer_name', dealerName);
            setCarData(data);
        } 
        catch (error) {
            console.error('Error during login:', error.message);
        }
    }, [dealerName]);

    useEffect(() => {
        handleInventory();
    }, [handleInventory]); 

    return (
        <>
            <DealerNavbar />
            <Container>
                <Form className="d-flex justify-content-end mt-5 me-5">
                    <Form.Control
                        type="search"
                        placeholder="Search here. . ."
                        className="me-2 w-25"
                        aria-label="Search"
                        onChange={event => setSearchTerm(event.target.value)}
                    />
                </Form>
            </Container>
            {error && <p>{error}</p>}
            {carData && (
                <Container className='flexcon mt-4'>
                    {carData.filter(car => car.car_name.toLowerCase().includes(searchTerm.toLowerCase())).map((car) => (
                        <CarCard key={car.vin} car={car} />
                    ))}
                </Container>
            )}
        </>
    );
};

function CarCard({ car }) {
    const {car_name, price, image_path, stocks} = car;
    
    return (
        <>
            <Container>
            <Card style={{ maxWidth: '540px', 
                            padding: '20px 20px',
                            border: 'none'
                        }}>
                    <Row>
                        <Col sm={7}>
                            <Card.Img src={image_path} />
                        </Col>
                        <Col sm={5}>
                            <Card.Title className="mt-2">{car_name}</Card.Title>
                            <Card.Text>Price: {price}<br/>Stocks: {stocks}</Card.Text>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </>
    );
}


export default DealerInventory;