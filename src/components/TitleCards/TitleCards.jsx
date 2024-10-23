import React, { useState, useEffect } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, apiEndpoint }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create a unique cache key based on the apiEndpoint to ensure distinct caches
  const cacheKey = `movies_cache_${encodeURIComponent(apiEndpoint)}`;

  const fetchMovies = async () => {
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Cache the new movies data with the current timestamp
      const cacheData = {
        movies: data.cards,
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));

      // Update state with new data
      setMovies(data.cards);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  useEffect(() => {
    // Check local storage for cached movies data using the unique cacheKey
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { movies } = JSON.parse(cachedData);

      // Use the cached data if available
      setMovies(movies);
      setLoading(false); // Set loading to false as we have cached data

      // Fetch new movies data from the API in the background
      fetchMovies(); // This will refresh the cache only when a successful response is received
    } else {
      // No cached data, fetch movies data from the API
      fetchMovies();
    }
  }, [apiEndpoint]); // Refetch if the apiEndpoint changes

  return (
    <div className='title-cards'>
      <h2>{title ? title : "Popular on BootStream"}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-list">
          {movies.length > 0 ? (
            movies.map((card, index) => (
              <Link to={`/player/${card.id}`} className="card" key={index}>
                <img src={card.album_art_path} alt={card.name} />
              </Link>
            ))
          ) : (
            <p>Refreshing cards...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TitleCards;
