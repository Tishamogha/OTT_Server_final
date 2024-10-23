import React, { useEffect, useRef, useState } from 'react';
import './Movie.css';
import { Link } from 'react-router-dom';

const Movie = ({ title }) => {
    const [apiData, setApiData] = useState([]);
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
    }

    useEffect(() => {
        fetch(`http://localhost/get_movies_list_json.php`, options)
            .then(response => response.json())
            .then(response => setApiData(response.cards))
            .catch(err => console.error(err));

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
                {apiData.map((card) => (
                    <Link to={`/player/${card.id}`} className="card" key={card.id} state={{ url: card.url }}>
                        <img src={card.album_art_path} alt={card.name} />
                        <p>{card.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Movie;
