import React, { useEffect, useState } from 'react';
import './WatchList.css';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

const WatchList = () => {
  const [watchList, setWatchList] = useState([]);
  const user = JSON.parse(localStorage.getItem('userData'));
  const userId = user.id;

  useEffect(() => {
    const fetchWatchList = async () => {
      try {
        const response = await fetch('https://moviemate.azurewebsites.net/api/WatchList/get_user_watchlist', {
          method: 'POST',
          headers: {    
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const watchListData = await response.json();
          console.log(watchListData);
          setWatchList(watchListData);
        } else {
          console.error('Error fetching watchlist:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };

    fetchWatchList();
  }, [userId]);

  return (
    <div id="watchListContainer">
      {watchList.map((entry) => (
        <div key={entry.id} className="movie-container">
          <div className="left-side img">
          <img src={entry.poster} alt="Movie Poster" />

          </div>
          <div className="right-side">
            <h2>{entry.title}</h2>
            <p>{entry.synopsis}</p>
            <p>{entry.genre.name}</p>
            <p>Release Date: {new Date(entry.releaseDate).toLocaleDateString('en-US')}</p>
            <Box component="fieldset" borderColor="transparent" >
            <Rating name="read-only" value={entry.averageRating} readOnly precision={0.5} />
          </Box>
            <a href={entry.trailer} target="_blank" rel="noopener noreferrer">
              Watch Trailer
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WatchList;
