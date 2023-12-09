import React, { useEffect, useState } from 'react';
import './PaymentForm.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';




const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userData'));
  
  const userId = user ? user.id : null;
  console.log("Uder date is ",userId);
  

  const movie = (location.state && location.state.formData) || null;
  const handleNameChange = (e) => {
    const value = e.target.value;
  
    const invalidCharacters = /[;:!@#$%^*+?/<>1234567890]/;
    const hasInvalidCharacters = invalidCharacters.test(value);
  
    if (hasInvalidCharacters) {
      setCardholderNameError('Cardholder name should not contain special characters or numbers.');
    } else {
      setCardholderNameError('');
      
    }
    setName(value);
  
    
  };

  useEffect(() => {
    if (!user ) {
        Swal.fire({
        icon: 'error',
        title: 'Unauthorized Access',
        text: 'You need to log in to access this page.',
      });
      navigate("/login");
    }
    else if(user.userType==="user"){
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized Access',
          text: "You don't have necessary permission to access this page",
        });
        navigate("/moviehome");
    }
  }, [user, navigate]);
  
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState('');
  const [isExpiryValid, setIsExpiryValid] = useState(true);
  const [cardholderNameError, setCardholderNameError] = useState(''); 


  const [cvvError, setCvvError] = useState(false)
  const cvvRegex = /^[0-9]{3}$/;

  const detectCardType = number => {
    const re = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
    };

    if (re.visa.test(number)) {
      return 'Visa';
    } else if (re.mastercard.test(number)) {
      return 'MasterCard';
    } else if (re.amex.test(number)) {
      return 'American Express';
    }

    return 'Enter a valid card details The accepted cards are Visa,MasterCard and Amex';
  };

  const handleCardNumberChange = e => {
    const number = e.target.value;
    setCardNumber(number);
    setCardType(detectCardType(number));
  };
  const handleCvvChange = (e) => {
    const value = e.target.value;

    console.log(cvvRegex.test(value))
    if (value.length > 2) {
      if (cvvRegex.test(value) || value === '') {
        setCvv(value);
        setCvvError(false)
      } else if (!cvvRegex.test(value)) {
        setCvvError(true)
      }
    } else {
      setCvv(value)
    }
  };


  const handleExpiryChange = (e) => {
    const inputValue = e.target.value;
    setExpiry(inputValue);
  
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
  
    const isValidFormat = expiryRegex.test(inputValue);
  
    if (isValidFormat) {
      const [month, year] = inputValue.split('/');
  
      const expiryDate = new Date(`${year}-${month}-01`);
  
      if (expiryDate >= new Date("2016-01-01") && expiryDate <= new Date("2031-12-31") ) {
        setIsExpiryValid(true);
      } else {
        setIsExpiryValid(false);
      }
    } else {
      setIsExpiryValid(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !cardNumber || !expiry || !cvv || !cardType || !isExpiryValid || cvvError || cardholderNameError ) {
      console.error('Invalid form data. Please check all fields.');
      return;
    }
    const expire=expiry;
    const paymentPayload = {
      name,
      cardNumber,
      expire,
      cvv,
      cardType,
      movie,
      userId
    };
    console.log('Form submitted', JSON.stringify(paymentPayload));
    try {
       
      const response = await fetch('https://moviemate.azurewebsites.net/api/SponsorshipPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      });
  
      if (response.ok) {
        console.log('Payment successful:');
        Swal.fire({
          icon: 'success',
          title: 'Payment done successfully',
          text: 'Redirecting to home page',
        });
        navigate("/moviehome");
      } else {
        console.error('Payment failed:', response.statusText);
        Swal.fire({
          icon: 'failure',
          title: 'Payment failed could not be completed',
          text: 'Redirecting to home page',
        });
        navigate("/moviehome");
      }
    } catch (error) {
      console.error('Error during payment:', error.message);
      Swal.fire({
        icon: 'failure',
        title: 'Payment failed could not be completed',
        text: 'Redirecting to home page',
      });
      navigate("/moviehome");
    }
  };
  const isFormValid =
  name &&
  cardNumber &&
  expiry &&
  cvv &&
  cardType &&
  isExpiryValid &&
  !cvvError;
  

  return (
    <div className="payment-form">
      <h2 style={{color: 'white'}}>Payment Details</h2>
      <form onSubmit={handleSubmit} style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', color: 'black'}}>
      <label htmlFor="name">Name on Card</label>
      <input id="name" type="text" value={name} onChange={handleNameChange} />
      {cardholderNameError && <span className="error-message">{cardholderNameError}</span>}
        
        <label htmlFor="cardNumber">Card Number</label>
        <input id="cardNumber" type="text" value={cardNumber} onChange={handleCardNumberChange} />
        {cardType && <div className="card-type"><span className="error-message">{`${cardType}`}</span></div>}
        
        <div className="expiry-cvv">
          <div>
            <label htmlFor="expiry">Valid Through</label>
            <input
              id="expiry"
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM/YYYY"
              style={{ borderColor: isExpiryValid ? 'initial' : 'red' }}
            />
            {!isExpiryValid && <p style={{ color: 'red' }}>Please enter a valid and future expiry date (MM/YYYY).</p>}
          </div>
          
          <div>
            <label htmlFor="cvv">CVV</label>
            <input id="cvv" type="text" value={cvv} onChange={handleCvvChange} maxLength="3" />
            {cvvError && (<span style={{color: 'red'}}>Please enter correct CVV</span>)}
          </div>
        </div>
        
        <button type="submit" disabled={!isFormValid}>
          Pay
        </button>
       
      </form>
      
    </div>
  );
};

export default PaymentForm;
