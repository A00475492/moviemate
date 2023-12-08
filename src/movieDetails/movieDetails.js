import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const user = JSON.parse(localStorage.getItem('userData'));
  const userId=user.id;
  console.log(id,"MovieId");
  console.log(userId,"UserId");
  

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://moviemate.azurewebsites.net/api/Movie/${id}`);
        if (response.ok) {
          const data = await response.json();
          setMovieDetails(data);
          console.log(JSON.stringify(data));
        } else {
          console.error('Error fetching movie details');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBackButtonClick = () => {
    navigate('/movieHome');
  };

  const handleUserRatingChange = async (newValue) => {
    setUserRating(newValue);
    setHasRated(true);
  
    console.log('User Rating:', newValue);
  
    try {
      const requestBody = {
        rate: newValue,
        movieId: id,
        userID: userId,
      };

      console.log(JSON.stringify(requestBody));
  
      const response = await fetch('https://moviemate.azurewebsites.net/api/Rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        
        console.log('Rating added successfully');
        Swal.fire({
          icon: 'success',
          title: 'Thanks for your Rating',
          text: 'Rating has been addedd succesfully',
         
        });
      } else {
       
        console.error('Failed to add rating:', response.statusText);
        Swal.fire({
          icon: 'failure',
          title: 'Error in adding Rating',
          text: response.statusText,
         
        });
      }
    } catch (error) {
      console.error('An error occurred while adding rating:', error);
      Swal.fire({
        icon: 'failure',
        title: 'Error in adding Rating',
        text: error,
       
      });
    }
  };
  

  if (!movieDetails) {
    return <div className="loading">Loading...</div>;
  }

  const favoriteOnClick = async () => {
    try {
      const requestBody = {
        userID: userId,
        movieID: id,
      };
  
      const response = await fetch('https://moviemate.azurewebsites.net/api/WatchList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Added to Watchlist',
          text: 'The movie has been added to your watchlist successfully.',
        });
      } else {
        console.error('Failed to add to watchlist:', response.statusText);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong. Please try again later.',
        });
      }
    } catch (error) {
      console.error('An error occurred while adding to watchlist:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <div className="movie-details-container">
      <ReactPlayer
        className="trailer-video"
        url={movieDetails.trailer}
        controls
        width="100%"
        height="50vh"
      />

      <div style={{display: 'flex', height: '50vh'}}>
          <div className="movie-details-movie-card">
        <img className="poster-image" src={movieDetails.poster} alt="Movie Poster" />
          </div>
      
          <div className="movie-info">
        <h2>{movieDetails.title}</h2>
        <p className="synopsis">Synopsis: {movieDetails.synopsis}</p>
        <p className="genre">Genre: {movieDetails.genreID}</p>
        <p className="average-rating">
          Average Rating:
          <Box component="fieldset" borderColor="transparent" >
            <Rating name="read-only" value={movieDetails.averageRating} readOnly precision={0.5} />
          </Box>
        </p>
        {hasRated ? (
          <p className="user-rating">
            Your Rating: {userRating}
          </p>
        ) : (
          <p className="user-rating">
            Your Rating:
            <Box component="fieldset" borderColor="transparent">
              <Rating
                name="user-rating"
                value={userRating}
                onChange={(event, newValue) => handleUserRatingChange(newValue)}
                precision={0.5}
              />
            </Box>
          </p>
        )}
        
            </div>

          <span>
            <FavoriteBorderIcon style={{cursor: 'pointer', marginRight: '10px'}} onClick={() => favoriteOnClick()} />
            Add to favorites
          </span>
      </div>

      
      <button className="back-button" onClick={handleBackButtonClick}>
        Back to Movie Home
      </button>
    </div>
  );
};

export default MovieDetails;
