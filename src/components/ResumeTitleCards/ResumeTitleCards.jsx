import React, { useState, useEffect } from 'react';
import './ResumeTitleCards.css';
import { Link } from 'react-router-dom';

const ResumeWatch = () => {
    const [movies, setMovies] = useState([]);
    const apiUrl = import.meta.env.VITE_GET_SHOWS_WATCHED+"Sourav Modak";


    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(apiUrl);
                const text = await response.text();
                const json = JSON.parse(text);
                setMovies(json.cards);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className='resume-title-cards'>
            <h2>Watch History</h2>
            <div className="card-list">
                {movies && movies.length > 0 ? (
                    movies.map((card) => {
                        const progress = Math.min((card.position / card.duration) * 100, 100);
                        return (
                            <Link
                                to={`/player/${card.serial}`}
                                className="card"
                                key={card.serial}
                                state={{ url: card.url, name: card.name, id: card.serial }}
                            >
                                <img src={card.album_art_path} alt={card.name} />
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <p>Loading watch history...</p>
                )}
            </div>
        </div>
    );
};

export default ResumeWatch;
