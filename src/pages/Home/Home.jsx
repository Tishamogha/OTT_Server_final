import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import play_icon from '../../assets/play_icon.png';
import info_icon from '../../assets/info_icon.png';
import TitleCards from '../../components/TitleCards/TitleCards';
import Footer from '../../components/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [movieData, setMovieData] = useState(null);
  const [movieList, setMovieList] = useState([]); // Store the list of 6 movies
  const [titleCardsData, setTitleCardsData] = useState({}); // Store data for all title cards
  const [loading, setLoading] = useState(true);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0); // Track the current movie being displayed
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_GET_MOVIES_RANDOM_API_URL;
  const apiResetUrl = import.meta.env.VITE_RESET_DISK__URL;

  // Cache keys
  const heroCacheKey = 'moviesCache';
  const titleCardsCacheKey = 'titleCardsCache';
  const cacheExpiry = 3600000; // 1 hour cache expiry time

  // Function to check if cache is expired
  const isCacheExpired = (cacheItem) => {
    const currentTime = new Date().getTime();
    return !cacheItem || currentTime - cacheItem.timestamp > cacheExpiry;
  };

  // Fetch movies
  const fetchMovieData = async (forceReload = false) => {
    const cachedData = JSON.parse(localStorage.getItem(heroCacheKey));

    if (!forceReload && cachedData && !isCacheExpired(cachedData)) {
      setMovieList(cachedData.cards);
      setMovieData(cachedData.cards[0]);
      setLoading(false);
    } else {
      try {
        const response = await fetch(`${apiUrl}` + 6);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        localStorage.setItem(heroCacheKey, JSON.stringify({ ...data, timestamp: new Date().getTime() }));
        setMovieList(data.cards);
        setMovieData(data.cards[0]);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch title cards data
  const fetchTitleCardsData = async (forceReload = false) => {
    const cachedTitleCards = JSON.parse(localStorage.getItem(titleCardsCacheKey));
  
    if (!forceReload && cachedTitleCards && !isCacheExpired(cachedTitleCards)) {
      const { timestamp, ...restOfCachedData } = cachedTitleCards;
      setTitleCardsData(restOfCachedData);
    } else {
      const endpoints = ['10', '20', '30', '40'];
      const titles = ['Critically Acclaimed Movies', 'Only on BootStream', 'Upcoming', 'Top Picks for You'];
  
      const titleCards = {};
      try {
        for (let i = 0; i < endpoints.length; i++) {
          const response = await fetch(`${apiUrl}${endpoints[i]}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          titleCards[titles[i]] = data.cards;
        }
  
        localStorage.setItem(titleCardsCacheKey, JSON.stringify({ ...titleCards, timestamp: new Date().getTime() }));
        setTitleCardsData(titleCards);
      } catch (error) {
        console.error('Error fetching title cards data:', error);
      }
    }
  };

  useEffect(() => {
    fetchMovieData();
    fetchTitleCardsData();

    const handleRefresh = () => {
      fetchMovieData(true); // Force background reload
      fetchTitleCardsData(true);
    };

    window.addEventListener('popstate', handleRefresh);

    return () => {
      window.removeEventListener('popstate', handleRefresh);
    };
  }, []);

  // Cycle through the movies every 3 seconds
  useEffect(() => {
    if (movieList.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentMovieIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % movieList.length; // Cycle through the movie list
          setMovieData(movieList[nextIndex]);
          return nextIndex;
        });
      }, 3000); // Update every 3 seconds

      return () => clearInterval(intervalId);
    }
  }, [movieList]);

  // Function to call the external API every 30 seconds when idle
  const callReloadDiskAPI = async () => {
    try {
      const response = await fetch(`${apiResetUrl}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Disk reload API called successfully');
    } catch (error) {
      console.error('Error calling reload disk API:', error);
    }
  };

  useEffect(() => {
    // Set up interval to call the API every 30 seconds
    const idleInterval = setInterval(() => {
      callReloadDiskAPI();
    }, 30000); // Call every 30 seconds

    return () => clearInterval(idleInterval); // Cleanup on component unmount
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
              <p dangerouslySetInnerHTML={{ __html: movieData.des.replace(/\n/g, '<br />') }} />
              <div className="hero-btns">
                <Link
                  to={`/player/${movieData.id}`}
                  className='btn play-btn'
                  state={{
                    url: movieData.url,
                    name: movieData.name,
                    type: "Movie"
                  }}
                >
                  <img src={play_icon} alt="Play" />Play
                </Link>
                <button className='btn dark-btn'><img src={info_icon} alt="More Info" />More Info</button>
              </div>
            </div>
          </>
        ) : (
          <p>Refreshing page...</p>
        )}
      </div>
      <div className="more-cards">
        {Object.keys(titleCardsData).map((title, idx) => (
          <TitleCards key={idx} title={title} movies={titleCardsData[title]} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
