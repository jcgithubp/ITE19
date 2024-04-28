import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Image from 'react-bootstrap/Image';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

function DealerNavbar() {
  const navigate = useNavigate();
  const logout = async () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Navbar expand="lg" sticky="top" style={{
        backgroundColor: "#12bca2"
      }}>
      <Container>
        <Image src='Automotive.png' style={{width: '60px', height: '60px'}}/> 
        <Navbar.Brand href="dealerhome" style={{color: 'white'}}>Jora's Carshop</Navbar.Brand>
            <Navbar.Offcanvas bplacement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link href="/dealerhome" style={{color: 'white'}}>Cars</Nav.Link>
                        <Nav.Link href="/dealerinventory" style={{color: 'white'}}>Inventory</Nav.Link>
                        <Nav.Link href="/dealersales" style={{color: 'white'}}>Purchases</Nav.Link>
                        <Form className="d-flex">
                          <Button variant='outline-light' className='nav-button' onClick={logout}>Log Out</Button>
                        </Form>
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default DealerNavbar;