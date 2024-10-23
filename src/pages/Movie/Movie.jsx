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
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzYyNzI1N2VhNDM5N2IyM2EzN2FhYTI0ZGMyNWY3OCIsIm5iZiI6MTcyOTQ2NzUwNC41Njk3NDksInN1YiI6IjY3MTU5Mzc1OTk0MzYzN2NlNTgyODBjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iGJHIOXTFRvQuNcaTxl26ZcI4XM6ZU72f5ueXjCMRdY'
        }
    };

    const handleWheel = (event) => {
        event.preventDefault();
        cardsRef.current.scrollLeft += event.deltaY;
    }

    useEffect(() => {
        fetch(`http://localhost/get_movies_list_json.php`, options)
            .then(response => response.json())
            .then(response => setApiData(response.cards)) // Accessing 'cards' instead of 'results'
            .catch(err => console.error(err));

        cardsRef.current.addEventListener('wheel', handleWheel);
        
        return () => {
            // Cleanup event listener on unmount
            cardsRef.current.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className='movie-cards'>
            <h2>{title ? title : "Movies"}</h2>
            <div className="movie-list" ref={cardsRef}>
                {apiData.map((card) => (
                    <Link to={`/player/${card.id}`} className="card" key={card.id}>
                        <img src={card.album_art_path} alt={card.name} /> {/* Use album_art_path for the image */}
                        <p>{card.name}</p> {/* Use name for the title */}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Movie;
