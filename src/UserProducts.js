import { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar.js";
import { Col, Row, Card, Container, Button, Form, FloatingLabel } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import supabase from './SupabaseClient.js';
import './app.css';

function UserProducts(){
    const [carData, setCarData] = useState(null);
    const [error] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");


    const all = async () => {
        try {
          const { data } = await supabase
            .from('dealer_inventory')
            .select('*')
    
        console.log(data);
        setCarData(data);
        } catch (error) {
          console.error('Error during login:', error.message);
        }
    };

    useEffect(() => {
        all();
    }, []); 

    const handleLogin = async (dealer_name) => {
        try {
            if (dealer_name === 'All') {
                all();
            } else {
                const { data } = await supabase
                    .from('dealer_inventory')
                    .select('*')
                    .eq('dealer_name', dealer_name)
                setCarData(data);
            }
        } catch (error) {
          console.error('Error during login:', error.message);
        }
    };

    const onClickBuyNow = (car) => {
        const { dealer_name, car_name, car_style, price, VIN,image_path } = car;
        localStorage.setItem('dealer_name', dealer_name);
        localStorage.setItem('car_name', car_name);
        localStorage.setItem('car_style', car_style);
        localStorage.setItem('price', price);
        localStorage.setItem('VIN', VIN);
        localStorage.setItem('image_path', image_path);
        navigate('/userconfirm');
    };

    const handleFilterPrices = () => {
        const cleanedMinPrice = minPrice.replace(/[, ₱$€£]/g, '');
        const cleanedMaxPrice = maxPrice.replace(/[, ₱$€£]/g, '');
        const minPriceValue = parseFloat(cleanedMinPrice);
        const maxPriceValue = parseFloat(cleanedMaxPrice);
        const filtered = carData.filter((car) => {
            const carPrice = parseFloat(car.price.replace(/[, ₱$€£]/g, ''));
            return carPrice >= minPriceValue && carPrice <= maxPriceValue;
        });
        setCarData(filtered);
    };

    //  const resetFilters = () => {
    //      setMinPrice('');
    //      setMaxPrice('');
    //      all();
    //  };


    return(
        <>
            <UserNavbar />
            {error && <p>{error}</p>}
            <Container style={{ display: 'flex' }}>
                <Form className="d-flex justify-content-start mt-5 me-2 mr-3">
                     
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2 w-100"
                        aria-label="Search"
                        onChange={event => setSearchTerm(event.target.value)}
                    />
                </Form>
                <Form className="d-flex me-3" style={{ flex: '0 0 25%' }}>
                	<FloatingLabel
                            controlId="floatingSelect"
                            label="Select Brand"
                            className="mt-5 me-2 w-100"
                        >
                            <Form.Select aria-label="Floating label select example" onChange={e => handleLogin(e.target.value)}>
                                <option onClick={all}>All</option>
                                <option value='BMW'>BMW</option>
                                <option value='TOYOTA'>TOYOTA</option>
                            </Form.Select>
                        </FloatingLabel> 
                </Form>
		<Form className="d-flex mt-5 me-3" style={{ flex: '0 0 25%' }}>
                    <Form.Control
                        type="text"
                        placeholder="min price"
                        value={minPrice}
                        className="me-3 w-50"
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Form.Control
                        type="text"
                        placeholder="max price"
                        className="me-3 w-50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </Form>

                
                    <Button className="me-2 mt-5"
                        onClick={handleFilterPrices}
                        style={{
                            transition: 'background-color 0.3s ease',
                            color: 'white',
                            backgroundColor: "#12bca2",
                            borderColor: "none",
                            flex: '0 0 25%'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#12bca2'}
                    
                        
                        >
                        Apply
                    </Button>
                    {/* <Button
                        variant="outline-danger"
                        onClick={resetFilters}
                        className="ms-2"
                        style={{
                            borderColor: 'red',
                            borderWidth: '3px',
                            transition: 'background-color 0.3s ease',
                            fontWeight: 'bold'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'red'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Reset
                    </Button> */}
                    
                
                


            </Container>
            {carData && (
                <Container className='flexcon mt-4'>
                    {carData.filter(car => car.car_name.toLowerCase().includes(searchTerm.toLowerCase())
                    &&
                    (!minPrice || parseInt(car.price.replace(/[^\d]/g, '')) >= parseInt(minPrice)) &&
                    (!maxPrice || parseInt(car.price.replace(/[^\d]/g, '')) <= parseInt(maxPrice))

                )
                .map((car) => (
                        <CarCard key={car.vin} car={car} onClickBuyNow={onClickBuyNow} />
                    ))}
                </Container>
            )}
        </>
    );

    function CarCard({ car, onClickBuyNow }) {
        const { car_name, price, image_path, stocks } = car;
        
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
                                        Check Out
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Container>

            </>
        );
    }
}
export default UserProducts;