import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const MovieDetails = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '20px' }}>
      <h2>Movie Details Page</h2>
    </div>
  );
};

const PaymentDashboard = () => {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const user = JSON.parse(localStorage.getItem('userData'));
  const navigate = useNavigate();

  const amountPerPayment = 50;
  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized Access',
        text: 'You need to log in to access this page.',
      });
      navigate("/login");
    } else if (user.userType === "user" || user.userType === "producer") {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized Access',
        text: "You don't have necessary permission to access this page",
      });
      navigate("/moviehome");
    }
  }, [user, navigate]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch('https://moviemate.azurewebsites.net/api/SponsorshipPayment');
      if (response.ok) {
        const data = await response.json();
        setPaymentDetails(data);
      } else {
        console.error('Error fetching payment details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const calculateTotalAmount = () => {
    return paymentDetails.length * amountPerPayment;
  };

  const handleMovieLinkClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: 'white', borderBottom: '2px solid #333', paddingBottom: '10px' }}>Payment Dashboard</h1>

      <div style={{ color: 'white', marginTop: '20px' }}>
        <h2>Total Amount: ${calculateTotalAmount()}</h2>
      </div>

      <Routes>
        <Route
          path="/"
          element={<TableWithLinks paymentDetails={paymentDetails} handleMovieLinkClick={handleMovieLinkClick} amountPerPayment={amountPerPayment} />}
        />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </div>
  );
};

const TableWithLinks = ({ paymentDetails, handleMovieLinkClick, amountPerPayment }) => {
  return (
    <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
      <thead style={{ borderBottom: '2px solid #333', background: '#f0f0f0' }}>
        <tr>
          <th style={tableHeaderStyle}>ID</th>
          <th style={tableHeaderStyle}>Movie Details</th>
          <th style={tableHeaderStyle}>User Name</th>
          <th style={tableHeaderStyle}>Card Type</th>
          <th style={tableHeaderStyle}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {paymentDetails.map((payment, index) => (
          <tr key={payment.sponsorshipPaymentID} style={{ borderBottom: '1px solid #ccc', background: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
            <td style={tableCellStyle}>{payment.sponsorshipPaymentID}</td>
            <td style={tableCellStyle}>
              <Link to={`/movie/${payment.movieID}`} onClick={() => handleMovieLinkClick(payment.movieID)}>
                {` Click for Movie Details`}
              </Link>
            </td>
            <td style={tableCellStyle}>{payment.name}</td>
            <td style={tableCellStyle}>{payment.cardType}</td>
            <td style={tableCellStyle}>${amountPerPayment}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const tableHeaderStyle = {
  padding: '10px',
  textAlign: 'left',
  fontWeight: 'bold',
};


const tableCellStyle = {
  padding: '10px',
  border: '1px solid #ccc', // Add this line to include border
};

export default PaymentDashboard;
