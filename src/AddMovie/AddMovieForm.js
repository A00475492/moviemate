import React, { useEffect, useState } from 'react';
import './AddMovieForm.css';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@mui/material';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const AddMovieForm = ({ onAddMovie }) => {
  const navigate = useNavigate();

  const [promoteMovie, setPromoteMovie] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    synopsis: '',
    trailer: '',
    releaseDate: new Date().toISOString(),
    poster: '',
    genre: '',
    actor: '',
  });
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState([]);
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
    else if(user.userType==="user"){
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized Access',
          text: "You don't have necessary permission to access this page",
        });
        navigate("/moviehome");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await fetch('https://moviemate.azurewebsites.net/api/Actor');
        if (response.ok) {
          const actorData = await response.json();
          console.log(JSON.stringify(actorData));
          setActors(actorData);
        } else {
          console.error('Error fetching actors:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching actors:', error.message);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch('https://moviemate.azurewebsites.net/api/Genre');
        if (response.ok) {
          const genreData = await response.json();
          console.log(JSON.stringify(genreData));
          setGenres(genreData);
        } else {
          console.error('Error fetching genres:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching genres:', error.message);
      }
    };

    fetchActors();
    fetchGenres();
  }, []);

  const handleCheckboxChange = (e) => {
    setPromoteMovie(e.target.checked);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Special handling for actor and genre fields
    if (name === 'actor') {
      const selectedActor = actors.find((actor) => actor.name === value);
      if (selectedActor) {
        setNewMovie({
          ...newMovie,
          actor: value,
          actorId: selectedActor.id,
        });
      }
    } else if (name === 'genre') {
      const selectedGenre = genres.find((genre) => genre.name === value);
      if (selectedGenre) {
        setNewMovie({
          ...newMovie,
          genre: value,
          genreId: selectedGenre.id, 
        });
      }
    } else {
      setNewMovie({
        ...newMovie,
        [name]: value,
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const requestBody = {
        title: newMovie.title,
        synopsis: newMovie.synopsis,
        trailer: newMovie.trailer,
        poster: newMovie.poster,
        actorID: newMovie.actorId,
        genreID: newMovie.genreId,
        releaseDate: newMovie.releaseDate,
        sponsored: promoteMovie.toString(), 
      };
  
      console.log(JSON.stringify(requestBody));
  
      if (!promoteMovie) {
        const response = await fetch('https://moviemate.azurewebsites.net/api/Movie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
  
        if (response.ok) {
          console.log('Movie added successfully');
          setNewMovie({
            title: '',
            synopsis: '',
            poster: null,
            trailer: '',
          });
          setPromoteMovie(false);
          Swal.fire({
            icon: 'success',
            title: 'Movie Added successfully',
            text: 'Movie Added successfully navigating to the Home page',
          });
          navigate("/moviehome");
        } else {
          console.error('Error adding movie:', response.statusText);
          Swal.fire({
            icon: 'failure',
            title: 'failed adding moving',
            text: 'OOPS there were some error in adding movie , navigating to the Home page',
          });
          navigate("/moviehome");
        }
      } else {
        navigate('/payment', { state: { formData: requestBody } });
      }
    } catch (error) {
      console.error('Error adding movie:', error.message);
      Swal.fire({
        icon: 'failure',
        title: 'failed adding moving',
        text: 'OOPS there were some error in adding movie , navigating to the Home page',
      });
      navigate("/moviehome");
    }
  };
    return (
    <div className="add-movie-form">
      <h3>Add a New Movie</h3>
      <form onSubmit={handleFormSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={newMovie.title}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Synopsis:
          <textarea
            name="synopsis"
            value={newMovie.synopsis}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Trailer URL:
          <input
            type="url"
            name="trailer"
            value={newMovie.trailer}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Release Date:
          <input
            type="date"
            name="releaseDate"
            value={newMovie.releaseDate}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Poster (Image URL):
          <input
            type="url"
            name="poster"
            value={newMovie.poster}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Genre:
          <select
            name="genre"
            value={newMovie.genre}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select a genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Actor:
          <select
            name="actor"
            value={newMovie.actor}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select an actor</option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.name}>
                {actor.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Promote Movie ($50):
          <Checkbox
            checked={promoteMovie}
            onChange={handleCheckboxChange}
          />
        </label>
        

        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovieForm;
