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
  const [movieList, setMovieList] = useState([]); // Store the list of 6 movies
  const [loading, setLoading] = useState(true);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0); // Track the current movie being displayed

  const fetchMovieData = async () => {
    try {
      const response = await fetch('http://localhost/get_random_movies_list.php?limit=6');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Cache the new data in local storage
      localStorage.setItem('moviesCache', JSON.stringify(data));

      // Set the list of movies and the initial movie
      setMovieList(data.cards);
      setMovieData(data.cards[0]); // Display the first movie initially
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  useEffect(() => {
    // Check local storage for cached data
    const cachedData = JSON.parse(localStorage.getItem('moviesCache'));

    if (cachedData) {
      // If cached data is available, use it
      setMovieList(cachedData.cards);
      setMovieData(cachedData.cards[0]); // Display the first movie initially
      setLoading(false); // Set loading to false as we have cached data
    }

    // Fetch new data from the API in the background
    fetchMovieData();
  }, []);

  // Cycle through the movies every 5 seconds
  useEffect(() => {
    if (movieList.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentMovieIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % movieList.length; // Cycle through the movie list
          setMovieData(movieList[nextIndex]);
          return nextIndex;
        });
      }, 5000); // Update every 5 seconds

      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [movieList]);

  return (
    <div className='home'>
      <Navbar />
      <div className="hero">
        {loading ? (
          <p>Loading...</p> // Display a loading message while fetching data
        ) : movieData ? (
          <>
            <img src={movieData.album_art_path} alt={movieData.name} className='banner-img' />
            <div className="hero-caption">
              <h2>{movieData.name}</h2>
              <p dangerouslySetInnerHTML={{ __html: movieData.des.replace(/\n/g, '<br />') }} />
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
                  <img src={play_icon} alt="Play" />Play
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
        <TitleCards title={"Critically Acclaimed Movies"} apiEndpoint="http://localhost/get_random_movies_list.php?limit=10" />
        <TitleCards title={"Only on BootStream"} apiEndpoint="http://localhost/get_random_movies_list.php?limit=10" />
        <TitleCards title={"Upcoming"} apiEndpoint="http://localhost/get_random_movies_list.php?limit=10" />
        <TitleCards title={"Top Picks for You"} apiEndpoint="http://localhost/get_random_movies_list.php?limit=10" />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
