import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './AddGenre.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const AddGenre = () => {
  const navigate = useNavigate();

  const [genreData, setGenreData] = useState({
    name: '',
    description: '',
  });
  const user = JSON.parse(localStorage.getItem('userData'));
  useEffect(() => {
    if (!user ) {
        Swal.fire({
        icon: 'error',
        title: 'Unauthorized Access',
        text: 'You need to log in to access this page.',
      });
      navigate("/login");
    }
    else if(user.userType!=="admin"){
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized Access',
          text: "You don't have necessary permission to access this page",
        });
        navigate("/moviehome");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setGenreData({ ...genreData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    fetch('https://moviemate.azurewebsites.net/api/Genre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(genreData)
    })
      .then(response => {
        if (response.ok) {
          console.log('Genre added successfully');
          Swal.fire({
            icon: 'success',
            title: 'Genre Added successfully!',
            text: 'Redirected to Movie Home Page',
          });
          navigate('/movieHome'); // Navigate to /movieHome
        } else {
          console.error('Error adding genre');
          Swal.fire({
            icon: 'error',
            title: 'Error adding actor',
            text: 'An error occurred while deleting the actor. You will be redirected to Movie Home.',
            
          });
          navigate('/moviehome');
        }
      })
      .catch(error => console.error('Error:', error));;
        navigate('/movieHome'); // Navigate to /movieHome
  };

  return (
    <div className="genre-container">
      <h1>Add Genre</h1>
      <form>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={genreData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={genreData.description}
          onChange={handleChange}
          required
        ></textarea>

        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddGenre;
