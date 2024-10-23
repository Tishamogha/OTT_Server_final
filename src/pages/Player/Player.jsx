import React, { useState, useEffect } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useLocation } from 'react-router-dom';

const Player = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        // Check if the video URL is passed from Movie.jsx via Link state
        if (location.state && location.state.url) {
            setVideoUrl(location.state.url);
        } else {
            console.error("No video URL provided");
        }
    }, [location]);

    return (
        <div className='player'>
            
            {videoUrl ? (
                <video
                    key={videoUrl}  // Force re-render when videoUrl changes
                    controls 
                    autoPlay 
                    width="100%" 
                    height="auto"
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p>Loading video...</p>
            )}
            
            <br />
            <div className="player-info">
                <p className='b'>{location.state ? location.state.name : "Movie"}</p>
                <p className='c'>{location.state ? location.state.type : "Trailer"}</p>
            </div>
        </div>
    );
}

export default Player;
