import React, { useState, useEffect } from 'react';
import './moviehome.css';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const MovieHome = () => {
  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filters, setFilters] = useState({
    actors: '',
    genre: ''
  });
const navigate=useNavigate();
  const handleFilterChange = (keyVal, value) => {
    setFilters({
      ...filters,
      [keyVal]: value
    });
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
  }, [user, navigate]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://moviemate.azurewebsites.net/api/Movie');
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        console.log(data);
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    const fetchActors = async () => {
      try {
        const response = await fetch('https://moviemate.azurewebsites.net/api/Actor');
        if (!response.ok) {
          throw new Error('Failed to fetch actors');
        }
        const data = await response.json();
        setActors(data);
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch('https://moviemate.azurewebsites.net/api/Genre');
        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchMovies();
    fetchActors();
    fetchGenres();
  }, []);

  useEffect(() => {
    console.log(movies, filters)
    if (filters.actors === '' && filters.genre === '') {
      setFilteredMovies(movies.filter(movie => movie.sponsored==="true"));
    } else if (filters.actors !== '' && filters.genre !== '') {
      setFilteredMovies(movies.filter((movie) => movie.actor.name === filters.actors && movie.genre.name === filters.genre));
    } else if (filters.actors !== '') {
      setFilteredMovies(movies.filter((movie) => movie.actor.name === filters.actors))
    } else {
      setFilteredMovies(movies.filter((movie) => movie.genre.name === filters.genre));
    }
  }, [movies, filters]);

  return (
    <div>
      <div className="movie-filters-container">
        <FormControl className="filter-dropdown">
          <InputLabel id="filter-label-actors">Actors</InputLabel>
          <Select
            labelId="filter-label-actors"
            id="filter-select-actors" 
            label="Actors"
            value={filters.actors}
            onChange={(e) => handleFilterChange('actors', e.target.value)}
            style={{background: 'white'}}
          >
            <MenuItem value="">Select Actor</MenuItem>
            {actors.map((actor) => (
              <MenuItem key={actor.id} value={actor.name}>
                {actor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="filter-dropdown">
          <InputLabel id="filter-label-genre">Genre</InputLabel>
          <Select
            labelId="filter-label-genre"
            id="filter-select-genre"
            label="Genre"
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            style={{background: 'white'}}
          >
            <MenuItem value="">Select Genre</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.name}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <Link className='movie-card'  to={`/movie/${movie.id}`} key={movie.id}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px', width: '100%'}}>
              <img src={movie.poster} alt={movie.title} />
              <div style={{color: 'black'}}>
                <h2>{movie.title}</h2>
              </div>
            </div>
          </Link>
          // <Link className='movie-card'  to={`/movie/${movie.id}`} key={movie.id}>
          //   {/* <div className="movie-card"> */}
          //     <img src={movie.poster} alt={movie.title} />
          //   {/* </div> */}
          // </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieHome;
