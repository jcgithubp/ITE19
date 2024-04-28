import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Image from 'react-bootstrap/Image';
import { Button, Form } from 'react-bootstrap';

function UserNavbar() {
  return (
    <>
      <Navbar expand="lg" sticky="top" style={{
        backgroundColor: "#12bca2"
      }}>
      <Container>
        <Image src='Automotive.png' style={{width: '60px', height: '60px'}}/> 
        <Navbar.Brand href="/userproducts" style={{color: 'white'}}>Jora's Carshop</Navbar.Brand>
            <Navbar.Offcanvas bplacement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                    Offcanvas
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link href="/userproducts" style={{color: 'white'}}>Vehicles</Nav.Link>
                        <Nav.Link href="/userpurchase" style={{color: 'white'}}>Purchases</Nav.Link>
                        <Form className="d-flex">
                          <Button variant='outline-light' className='nav-button' href='/'>Log Out</Button>
                        </Form>
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default UserNavbar;