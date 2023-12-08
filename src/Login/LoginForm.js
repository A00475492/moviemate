import React, { useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './LoginForm.css';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://moviemate.azurewebsites.net/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("userData", JSON.stringify(responseData));
        setMessage('Login successful!');
        navigate('/moviehome');
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while processing your request.');
    }
  };

  const handleRegisterClick = () => {
    navigate('/Register');
  };

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol sm='6'>
            <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
              <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Log in</h3>

              <MDBInput
                wrapperClass='mb-4 mx-5 w-100'
                label='Email address'
                id='formControlLg'
                type='email'
                size='lg'
                onChange={handleChange}
                name='username'
                labelClass='text-light'
                inputClass='text-light'
                style={{ color: 'white' }}
              />
              <MDBInput
                wrapperClass='mb-4 mx-5 w-100'
                label='Password'
                id='formControlLg'
                type='password'
                size='lg'
                onChange={handleChange}
                name='password'
                labelClass='text-light'
                inputClass='text-light'
                style={{ color: 'white' }}
                
              />

              <MDBBtn className='mb-4 px-5 mx-5 w-100' color='info' size='lg' onClick={handleSubmit}>
                Login
              </MDBBtn>
              <div className='ms-5 mb-2 text-light'>{message}</div>
              <p className='ms-5'>
                Don't have an account?{' '}
                <a href='#!' className='link-info' onClick={handleRegisterClick}>
                  Register here
                </a>
              </p>
            </div>
          </MDBCol>

          <MDBCol sm='6' className='d-none d-sm-block px-0'>
            <img src={process.env.PUBLIC_URL + '/login.jpg'} alt='Login' className='w-100' style={{ objectFit: 'cover', objectPosition: 'left' }} />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default LoginForm;
