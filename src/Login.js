import React, { useState } from "react";
import { FloatingLabel, Form, Col, Row, Button, Container } from "react-bootstrap";
import supabase from "./SupabaseClient";
import { useNavigate } from 'react-router-dom';
import './bootstrap/bootstrap.min.css';

function Login(){
    
  const [option, setOption] = useState('signin');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('customer');
    const navigate = useNavigate();

  const [error, setError] = useState(null);

  function changeOption(){
      setOption(option === "signin" ? "signup" : "signin")
  }
  
  const validateCustomer = async () => {
    try {
        const { data } = await supabase
            .from('user')
            .select('*')
            .eq('email', email)
            .single();

        if (data && data.password === password) {
            console.log('Login successful');
            console.log(data);
            const user = data.user_name;
            localStorage.setItem('user_name', user);
            console.log(user);
            navigate("/userproducts");
        }
    } 
    catch (error) {
        console.error('Error during login:', error.message);
    }
};

const validateDealer = async () => {
    try {
        const { data } = await supabase
            .from('dealer')
            .select('*')
            .eq('email', email)
            .single();

        if (data && data.password === password) {
            const dealer = data.dealer_name;
            localStorage.setItem('dealer_name', dealer);
            navigate("/dealerhome")
        }
    } 
    catch (error) {
        console.error('Error during login:', error.message);
    }
};

const handleClick = () => {
  if (userType === "customer") {
      validateCustomer(); 
  } 
  else {
     validateDealer();
  }
//    setLoading(true);
}

const handleRegister = async () => {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // You can perform actions upon successful registration, like sending a verification email
    console.log('Registered:', user);
  } catch (error) {
    setError(error.message);
  }

};


  
  if(option === "signup"){
      return(
          <div className="bg-login">
              <Container className="login-card">
                  <div className="login-div">
                      <div className="flex-content"><h1>Register</h1></div><br/><br/>
                      <Form>
                          <Form.Group className="mb-3" controlId="#">
                              
                              <FloatingLabel label="Email address" className="mb-3"> 
                                  <Form.Control type="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
                              </FloatingLabel>
                              <FloatingLabel controlId="#" label="Password">
                                  <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                              </FloatingLabel>
                              <Row className="g-2 mt-2">
                                  <Col sm={5}>
                                      <FloatingLabel label="Select role :">
                                          <Form.Select aria-label="Floating label select example">
                                              <option value="1">Customer</option>
                                              <option value="2">Dealer</option>
                                          </Form.Select>
                                      </FloatingLabel>
                                  </Col>
                                  <Col sm={5}><Button variant="success" className="register-button" onClick={handleRegister}>Register</Button></Col>
                              </Row><br/>
                              Already have an account? <span className="link-primary" onClick={changeOption}>Login</span>
                          </Form.Group>
                      </Form>
                  </div>
              </Container>
          </div>
      );
  }
  return(
    <>
      <div className="bg-login">
          <Container className="login-card">
              <div className="login-div">
                  <div className="flex-content"><h1>Login</h1></div><br/><br/>
                  <Form>
                      <Form.Group className="mb-3" controlId="#">
                          <FloatingLabel label="Email address" className="mb-3"> 
                              <Form.Control type="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
                          </FloatingLabel>
                          <FloatingLabel controlId="#" label="Password">
                              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                          </FloatingLabel>
                      </Form.Group>
                      <Col sm={12}>
                                    <FloatingLabel label="Login as :">
                                        <Form.Select value={userType} onChange={(e)=>setUserType(e.target.value)} aria-label="Floating label select example">
                                            <option value="customer">Customer</option>
                                            <option value="dealer">Dealer</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col><br />
                      <Button variant="success" className="login-button" onClick={handleClick}>Login</Button><br/><br/>
                      Don't have an account? <span className="link-primary" onClick={changeOption}>Register</span>
                  </Form>
              </div>
          </Container>
      </div>
      </>
  );
  
  
}
export default Login;