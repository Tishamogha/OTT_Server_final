import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import play_icon from '../../assets/play_icon.png';
import info_icon from '../../assets/info_icon.png';
import TitleCards from '../../components/TitleCards/TitleCards';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';

const Home = () => {
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMovieData = async () => {
    try {
      const response = await fetch('http://localhost/get_single_movie_random.php');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMovieData(data.card[0]); // Assuming the structure is as you provided
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false); // Ensuring loading state is updated
    }
  };

  useEffect(() => {
    fetchMovieData(); // Fetch initial movie data

    const intervalId = setInterval(() => {
      fetchMovieData(); // Fetch new movie data every 5 seconds
    }, 5000);

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, []);

  return (
    <div className='home'>
      <Navbar />
      <div className="hero">
        {loading ? (
          <p>Loading...</p>
        ) : movieData ? (
          <>
            <img src={movieData.album_art_path} alt={movieData.name} className='banner-img' />
            <div className="hero-caption">
              <h2>{movieData.name}</h2>
              <p>{movieData.des}</p>
              <div className="hero-btns">
                <Link 
                  to={`/player/${movieData.id}`} 
                  className='btn play-btn' 
                  state={{ 
                    url: movieData.url, // Video URL
                    name: movieData.name, // Movie name
                    type: "Movie" // Movie type (you can modify this as needed)
                  }}
                >
                  <img src={play_icon} alt="Play" className='.play-btn'/>Play
                </Link>
                <button className='btn dark-btn'><img src={info_icon} alt="More Info" />More Info</button>
              </div>
            </div>
          </>
        ) : (
          <p>No movie data available.</p>
        )}
      </div>
      <div className="more-cards">
        <TitleCards title={"BlockBuster Movies"} category={"top_rated"} />
        <TitleCards title={"Only on BootStream"} category={"popular"} />
        <TitleCards title={"Upcoming"} category={"upcoming"} />
        <TitleCards title={"Top Picks for You"} category={"now_playing"} />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
