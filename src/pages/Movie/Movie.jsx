import React, { useEffect, useRef, useState } from 'react';
import './Movie.css';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_GET_MOVIES_API_URL;

const Movie = ({ title }) => {
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const fetchMovies = async () => {
        try {
            const cachedData = localStorage.getItem('moviesData');
            let parsedCache = [];

            if (cachedData) {
                parsedCache = JSON.parse(cachedData);
                setApiData(parsedCache);
            }

            const response = await fetch(`${apiUrl}`, options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Use Set to ensure unique movie IDs
            const existingIds = new Set(parsedCache.map(card => card.id));
            const newMovies = data.cards.filter(card => !existingIds.has(card.id));

            const updatedMovies = [...parsedCache, ...newMovies];

            // Create a unique movie list based on 'id'
            const uniqueMovies = Array.from(new Map(updatedMovies.map(card => [card.id, card])).values());

            // Update localStorage only if the uniqueMovies array has changed
            if (JSON.stringify(uniqueMovies) !== JSON.stringify(parsedCache)) {
                localStorage.setItem('moviesData', JSON.stringify(uniqueMovies));
                setApiData(uniqueMovies);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching movies:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch on mount
        fetchMovies();

        // Add the scroll event listener to the cards
        if (cardsRef.current) {
            cardsRef.current.addEventListener('wheel', handleWheel);
        }

        // Set up interval to call the API every 30 seconds
        const intervalId = setInterval(() => {
            fetchMovies(); // Call the fetch function
        }, 30000); // 30 seconds

        return () => {
            if (cardsRef.current) {
                cardsRef.current.removeEventListener('wheel', handleWheel);
            }
            clearInterval(intervalId); // Cleanup interval on unmount
        };
    }, []);

    return (
        <div className='movie-cards'>
            <h2>{title ? title : "Movies"}</h2>
            <div className="movie-list" ref={cardsRef}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    apiData.length === 0 ? (
                        <p>No movies available.</p>
                    ) : (
                        apiData.map((card) => (
                            <Link to={`/player/${card.id}`} className="card" key={card.id} state={{ url: card.url, name: card.name }}>
                                <img src={card.album_art_path} alt={card.name} />
                            </Link>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default Movie;
