import React, { useEffect, useRef, useState } from 'react';
import './Movie.css';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_GET_MOVIES_API_URL;

const Movie = ({ title }) => {
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true); // For handling loading state
    const cardsRef = useRef();

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    const handleWheel = (event) => {
        event.preventDefault();
        if (cardsRef.current) {
            cardsRef.current.scrollLeft += event.deltaY;
        }
    };

    useEffect(() => {
        const cachedData = localStorage.getItem('moviesData');
        let parsedCache = [];

        // Load from cache if available
        if (cachedData) {
            parsedCache = JSON.parse(cachedData);
            setApiData(parsedCache); // Set the cache data to state first
            setLoading(false); // Assume cached data is fully loaded
        }

        const fetchMovies = async () => {
            try {
                const response = await fetch(`${apiUrl}`, options);
                const data = await response.json();

                // Use Set to ensure unique movie IDs
                const existingIds = new Set(parsedCache.map(card => card.id));
                const newMovies = data.cards.filter(card => !existingIds.has(card.id));

                // Combine cached and new movies and ensure no duplicates
                const updatedMovies = [...parsedCache, ...newMovies];
                
                // Use Set to filter unique movie cards (by 'id')
                const uniqueMovies = Array.from(new Set(updatedMovies.map(card => card.id)))
                    .map(id => updatedMovies.find(card => card.id === id));

                setApiData(uniqueMovies);
                localStorage.setItem('moviesData', JSON.stringify(uniqueMovies)); // Cache updated data
                setLoading(false); // All data has been loaded
            } catch (err) {
                console.error('Error fetching movies:', err);
                setLoading(false); // Error while fetching API; stop loading state
            }
        };

        // Only fetch movies if not already loading data
        fetchMovies();

        // Add the scroll event listener to the cards
        if (cardsRef.current) {
            cardsRef.current.addEventListener('wheel', handleWheel);
        }

        return () => {
            // Cleanup event listener on unmount
            if (cardsRef.current) {
                cardsRef.current.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    return (
        <div className='movie-cards'>
            <h2>{title ? title : "Movies"}</h2>
            <div className="movie-list" ref={cardsRef}>
                {loading ? (
                    <p>Loading...</p> // Show loader until all cards are loaded
                ) : (
                    apiData.length === 0 ? (
                        <p>No movies available.</p> // Placeholder if no data is found
                    ) : (
                        apiData.map((card) => (
                            <Link to={`/player/${card.id}`} className="card" key={card.id} state={{ url: card.url, name: card.name }}>
                                <img src={card.album_art_path} alt={card.name} />
                                {/* <p>{card.name}</p> */}
                            </Link>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default Movie;
