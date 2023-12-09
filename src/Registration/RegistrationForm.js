import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import provincesData from './provinces.json'; // Adjust the path accordingly
import './RegistrationForm.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useCallback } from 'react';

const RegistrationForm = ({ onRegistration }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    province: '',
    city: '',
    zipCode: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const invalidCharacters = /[;:!@#$%^*+?/<>1234567890]/;


    ['firstName', 'lastName','city'].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      } else {

        if (invalidCharacters.test(formData[field])) {
          newErrors[field] = 'Invalid characters are not allowed';
        }
      }
    });

   


    if (formData.country !== 'US' && formData.country !== 'Canada') {
      newErrors.country = 'Country must be US or Canada';
    }

    if (formData.country === 'Canada' && !isValidCanadianPostalCode(formData.zipCode)) {
      newErrors.zipCode = 'Invalid Canadian postal code';
    }
    if (formData.country === 'US' && !isValidUSZipCode(formData.zipCode)) {
      newErrors.zipCode = 'Invalid US ZIP code';
    }

    if (!isValidPhoneNumber(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number';
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
  },[formData]);

  useEffect(() => {
    validateForm();
  }, [formData, isSubmitting,validateForm]);

 

  const isValidCanadianPostalCode = (postalCode) => {
    const canadianPostalCodeRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    return canadianPostalCodeRegex.test(postalCode);
  };

  const isValidUSZipCode = (zipCode) => {
    const usZipCodeRegex = /^\d{5}(-\d{4})?$/;
    return usZipCodeRegex.test(zipCode);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+1\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const invalidCharacters = /[;:!@#$%^*+?/<>1234567890]/;
    const hasInvalidCharacters = invalidCharacters.test(value);
  
    if (name === 'firstName' || name === 'lastName' || name === 'city' ) {
      if (hasInvalidCharacters) {
        setErrors({
          ...errors,
          [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} should not contain special characters or numbers.`,
        });
      } else {
        setErrors({
          ...errors,
          [name]: '',
        });
      }
    }
    if (name === 'country') {
      setFormData({
        ...formData,
        [name]: value,
        province: '', 
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateForm();

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await fetch('https://moviemate.azurewebsites.net/api/User', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Registration successful:', responseData);
          Swal.fire({
            icon: 'success',
            title: 'Registration successful!',
            text: 'You can now log in with your credentials.',
          });
          navigate('/');
          if (onRegistration) {
            onRegistration(responseData);
          }
        } else {
          console.error('Registration failed:', response.statusText);
          const errorResponse = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Registration failed',
            text: `An error occurred during registration: ${errorResponse.message || 'Please try again.'}`,
          });
        }
      } catch (error) {
        console.error('Error during registration:', error);
        Swal.fire({
          icon: 'error',
          title: 'Registration failed',
          text: 'An error occurred during registration. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className='registration-form-container' style={{backgroundColor:'black'}}>
      <form onSubmit={handleSubmit} >
        <div className="form-group">
          <div className='form-row'>

            <div className='form-field'>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className='form-field'>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className='form-row'>

            <div className='form-field'>
          <label htmlFor="country">Country:</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="Canada">Canada</option>
          </select>
          {errors.country && <span className="error-message">{errors.country}</span>}
            </div>

            <div className='form-field'>
          <label htmlFor="province">Province:</label>
          <select
            id="province"
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            disabled={!formData.country}
          >
            <option value="">Select Province</option>
            {formData.country === 'US' &&
              provincesData.US.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            {formData.country === 'Canada' &&
              provincesData.Canada.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
          </select>
            </div>
          </div>
          
          <div className='form-row'>
            <div className='form-field'>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className='form-field'>
          <label htmlFor="zipCode">Zip Code:</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
          />
          {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
            </div>
          </div>
          {/* </div> */}
          {/* <div className='form-group-right'> */}
          <div className='form-row'>
            <div className='form-field'>
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
          />
          {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
            </div>

            <div className='form-field'>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
          <label htmlFor="userType">User Type:</label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
          >
            <option value="user">User</option>
            <option value="producer">Producer</option>
          </select>
            </div>

            <div className='form-field'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
          </div>

          <div className='form-row'>

            <div className='form-field'>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>
          {/* </div> */}
        </div>


        <button style={{backgroundColor: '#54b4d3'}} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      <img src={process.env.PUBLIC_URL + '/login.jpg'} alt='Login' className='registration-page-img' style={{ objectFit: 'cover', objectPosition: 'left' }} />
    </div>
  );
};

export default RegistrationForm;
