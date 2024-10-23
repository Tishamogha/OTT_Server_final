import React, { useEffect, useRef, useState } from 'react';
import './Movie.css';
import { Link } from 'react-router-dom';

const Movie = ({ title }) => {
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true); // To manage loading state
    const cardsRef = useRef();

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer your_token_here' // Replace with your actual token
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
        
        // Load from cache if available
        if (cachedData) {
            setApiData(JSON.parse(cachedData));
            setLoading(false);
        }

        const fetchMovies = async () => {
            try {
                const response = await fetch(`http://localhost/get_movies_list_json.php`, options);
                const data = await response.json();

                // Create a Set to track unique movie IDs
                const existingIds = new Set(apiData.map(card => card.id));
                const newMovies = data.cards.filter(card => !existingIds.has(card.id));

                // Combine existing and new movies
                const updatedMovies = [...apiData, ...newMovies];

                setApiData(updatedMovies);
                localStorage.setItem('moviesData', JSON.stringify(updatedMovies)); // Cache the updated data
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMovies();

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
                    <p>Loading...</p> // Placeholder while loading new data
                ) : (
                    apiData.map((card) => (
                        <Link to={`/player/${card.id}`} className="card" key={card.id} state={{ url: card.url }}>
                            <img src={card.album_art_path} alt={card.name} />
                            <p>{card.name}</p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Movie;
