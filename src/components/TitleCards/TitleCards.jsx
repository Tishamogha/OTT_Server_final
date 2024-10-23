import React, { useState, useEffect } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, apiEndpoint }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMovies(data.cards); // Assuming your API returns an array under "cards"
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  useEffect(() => {
    fetchMovies(); // Fetch movies when the component mounts
  }, [apiEndpoint]); // Refetch if the apiEndpoint changes

  return (
    <div className='title-cards'>
      <h2>{title ? title : "Popular on BootStream"}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-list">
          {movies.map((card, index) => (
            <Link to={`/player/${card.id}`} className="card" key={index}>
              <img src={card.album_art_path} alt={card.name} />
              {/* <p>{card.name}</p> */}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TitleCards;
