import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Table, Container, Button, Spinner, Alert, Card, Row, Col, ListGroup } from 'react-bootstrap';
import DealerNavbar from "./DealerNavbar.js";
import supabase from './SupabaseClient.js';
import Chart from 'chart.js/auto';

function UserPurchase() {
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [sortedPurchaseHistory, setSortedPurchaseHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dealer_name = localStorage.getItem('dealer_name');
    const car_name = localStorage.getItem('car_name');
    const [topCars, setTopCars] = useState([]);
    const [image_path, setImage] = useState();
    const [carName, setCarname] = useState();
    const [price, setPrice] = useState();
    const [count, setCount] = useState();
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const formatDate = (dateTimeString) => {
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        return new Date(dateTimeString).toLocaleString(undefined, options);
    };

    const fetchPurchaseHistory = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('dealer_sales')
                .select('*')
                .eq('dealer_name', dealer_name);

            if (error) {
                throw error;
            }
            setPurchaseHistory(data);
            setError(null);
        } catch (error) {
            console.error('Error during fetching purchase history:', error.message);
            setError('Error fetching purchase history. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [dealer_name]);

    const TopSales = useCallback(async () => {
const carName = localStorage.getItem("car_name");
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('dealer_inventory')
                .select('*')
                .eq('car_name', carName);

            if (error) {
                throw error;
            }
            console.log(data);
            setImage(data[0].image_path);
            setCarname(data[0].car_name);
            setPrice(data[0].price);

        } catch (error) {
            console.error('Error during fetching purchase history:', error.message);
            setError('Error fetching purchase history. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [dealer_name]);

    const handleShowTopCars = () => {
        const carCountMap = {};
        purchaseHistory.forEach((purchase) => {
            carCountMap[purchase.car_name] = (carCountMap[purchase.car_name] || 0) + 1;
        });
        const sortedCars = Object.keys(carCountMap).sort((a, b) => carCountMap[b] - carCountMap[a]).slice(0, 1);
        const topCarsData = sortedCars.map((carName) => ({
            carName,
            count: carCountMap[carName],
        }));
        setTopCars(topCarsData);
        console.log("car" + topCarsData[0].carName);
        const carName = topCarsData[0].carName;
        localStorage.setItem('car_name', carName);
        setCount(topCarsData[0].count);
        TopSales();
    };

    useEffect(() => {
        fetchPurchaseHistory();
    }, [fetchPurchaseHistory]);

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Count car names
        const carCounts = purchaseHistory.reduce((acc, purchase) => {
            acc[purchase.car_name] = (acc[purchase.car_name] || 0) + 1;
            return acc;
        }, {});

        const xValues = Object.keys(carCounts);
        const yValues = Object.values(carCounts);

        const ctx = chartRef.current.getContext('2d');
        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: '#12bca2',
                    data: yValues
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Sales'
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }, [purchaseHistory]);

    return (
        <>
        <DealerNavbar />
            <div style={{ display: 'flex', height: 'auto', overflow: 'scroll initial' }}>
                
                <div style={{ flex: 1, padding: '20px', height: 'auto' }}>
                    <Container>
                        <div className='mt-1 d-flex justify-content-end'>
                            <Card style={{ width: '25rem' }}>
				<Card.Header>
				Top Car Sale &nbsp;
				<Button 
				className="ms-5"
                            onClick={handleShowTopCars}
                            style={{
                                backgroundColor: '#12bca2',
                                borderColor: '#12bca2',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            Show top car sale
                        </Button>
				</Card.Header>
                                <Row>
                                    <Col><Card.Img variant="top" src={image_path} /></Col>
                                    <Col>
                                        <Card.Body>
                                            <Card.Title>{car_name}</Card.Title>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>{price}</ListGroup.Item>
                                            <ListGroup.Item>Number of Sales: {count}</ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Card>
                        </div>

                        <div style={{ display: 'flex', height: 'auto', overflow: 'scroll initial'}}>
                            <div style={{ flex: 1, padding: '20px'}}>
                                <Container className='mt-4'>
                                    <canvas ref={chartRef} id="myChart"></canvas>
                                </Container>
                            </div>
                        </div>
                       
                    </Container>
                </div>
            </div>
        </>
    );
}

export default UserPurchase;