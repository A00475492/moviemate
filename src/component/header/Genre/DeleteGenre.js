import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteGenre.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const DeleteGenre = () => {
  const navigate = useNavigate();

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    fetch('https://moviemate.azurewebsites.net/api/Genre')
      .then(response => response.json())
      .then(data => setGenres(data))
      .catch(error => console.error('Error fetching genres:', error));
  }, []);

  const handleGenreSelection = (genreId) => {
    const genre = genres.find(genre => genre.id === genreId);
    setSelectedGenre(genre);
  };

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

  const handleDelete = () => {
    if (!selectedGenre) return;

    fetch(`https://moviemate.azurewebsites.net/api/Genre/${selectedGenre.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          console.log('Genre deleted successfully');
          Swal.fire({
            icon: 'success',
            title: 'Genre deleted successfully!',
            text: 'You will be redirected to Movie Home.',
           
          });
          navigate('/moviehome');
        } else {
          console.error('Error deleting genre');
          Swal.fire({
            icon: 'success',
            title: 'Error in deleting Genre',
            text: 'You will be redirected to Movie Home.',
           
          });
          navigate('/moviehome');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="delete-genre-container">
      <h1>Delete Genre</h1>
      <div className="genre-list-container">
        <label htmlFor="genreList">Select a Genre:</label>
        <select
          id="genreList"
          onChange={(e) => handleGenreSelection(Number(e.target.value))}
        >
          <option value="">Select a genre</option>
          {genres && genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </div>
      {selectedGenre && (
        <div className="selected-genre-container">
          <h2>{selectedGenre.name}</h2>
          <p>Description: {selectedGenre.description}</p>
          <button onClick={handleDelete}>Delete Genre</button>
        </div>
      )}
    </div>
  );
};

export default DeleteGenre;
