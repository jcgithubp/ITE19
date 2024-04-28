import './app.css';
import DealerNavbar from "./DealerNavbar.js";
import { Col, Row, Card, Container, Button, Form } from "react-bootstrap";
import supabase from './SupabaseClient.js';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function CompanyVehicles(){
    const [carData, setCarData] = useState(null);
    const [error] = useState(null);
    const dealerName = localStorage.getItem('dealer_name');
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();;

    const handleLogin = useCallback(async () => {
        try {
            const { data } = await supabase
            .from('cars')
            .select('*') 
            .eq('dealer_name', dealerName);
            setCarData(data);
        } 
        catch (error) {
            console.error('Error during login:', error.message);
        }
    }, [dealerName]); 

    useEffect(() => {
        handleLogin();
    }, [handleLogin]);

    const onClickBuyNow = (car) => {
        const { dealer_name, car_name, car_style, price, VIN, image_path, stocks } = car;
        localStorage.setItem('dealer_name', dealer_name);
        localStorage.setItem('car_name', car_name);
        localStorage.setItem('car_style', car_style);
        localStorage.setItem('price', price);
        localStorage.setItem('VIN', VIN);
        localStorage.setItem('image_path', image_path);
        localStorage.setItem('stocks', stocks);
        navigate('/dealerconfirm');
    };
    
    return (
        <>
            <DealerNavbar />
            <Container>
                <Form className="d-flex justify-content-start mt-5 ms-5">
                    <Form.Control
                        type="search"
                        placeholder="Search"
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
                        <CarCard key={car.vin} car={car} onClickBuyNow={onClickBuyNow} />
                    ))}
                </Container>
            )}
        </>
    );
};
    
function CarCard({ car, onClickBuyNow }) {
    const {car_name, price, image_path, stocks} = car;
    const handleBuyNowClick = () => {
        onClickBuyNow(car);
    };
    
    return (
        <>
        <Container>
        <div className="mb-4">
                        <Card style={{ maxWidth: '540px', 
                            padding: '20px 20px',
                            border: 'none'
                        }}>
                            <Row>
                                <Col sm={7}>
                                    <Card.Img src={image_path} className="card-image" />
                                </Col>
                                <Col sm={5}>
                                    <Card.Title className="mt-2">{car_name}</Card.Title>
                                    <Card.Text>Price: {price}<br/>Stocks: {stocks}</Card.Text>
                                    <Button 
                                        style={{
                                            backgroundColor: "#12bca2",
                                            borderColor: "none !important"
                                          }}
                                        className="check-out" 
                                        onClick={handleBuyNowClick}
                                    >
                                        Buy Now
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </div>
        </Container>
        
        </>
      );
}

export default CompanyVehicles;