import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import play_icon from '../../assets/play_icon.png';
import info_icon from '../../assets/info_icon.png';
import TitleCards from '../../components/TitleCards/TitleCards';
import Footer from '../../components/Footer/Footer';
import ResumeWatch from '../../components/ResumeTitleCards/ResumeTitleCards';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [movieData, setMovieData] = useState(null);
  const [movieList, setMovieList] = useState([]); // Store the list of 6 movies
  const [titleCardsData, setTitleCardsData] = useState({}); // Store data for all title cards
  const [resumeData, setResumeData] = useState([]); // Store resume data
  const [loading, setLoading] = useState(true);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0); // Track the current movie being displayed
  const navigate = useNavigate();
  const resetInterval = import.meta.env.VITE_RESET_FILESYSTEM;

  const apiUrl = import.meta.env.VITE_GET_MOVIES_RANDOM_API_URL;
  const apiResetUrl = import.meta.env.VITE_RESET_DISK__URL;

  // Cache keys
  const heroCacheKey = 'moviesCache';
  const titleCardsCacheKey = 'titleCardsCache';
  const resumeDataCacheKey = 'resumeDataCache'; // Cache key for resume data
  const cacheExpiry = import.meta.env.VITE_AUTH_CACHE_EXPIRTY;

  // Function to check if cache is expired
  const isCacheExpired = (cacheItem) => {
    return true; // Placeholder for cache expiry logic
  };

  // Fetch movies
  const fetchMovieData = async (forceReload = false) => {
    const cachedData = JSON.parse(localStorage.getItem(heroCacheKey));

    if (!forceReload && cachedData && !isCacheExpired(cachedData)) {
      setMovieList(cachedData.cards);
      setMovieData(cachedData.cards[0]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/6`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      localStorage.setItem(
        heroCacheKey,
        JSON.stringify({ ...data, timestamp: new Date().getTime() })
      );

      setMovieList(data.cards);
      setMovieData(data.cards[0]);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch resume data
  const fetchResumeData = async () => {
    const cachedResumeData = JSON.parse(localStorage.getItem(resumeDataCacheKey));

    if (cachedResumeData) {
      setResumeData(cachedResumeData);
    } else {
      try {
        const response = await fetch(`${apiUrl}/resume-data`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        localStorage.setItem(resumeDataCacheKey, JSON.stringify(data));
        setResumeData(data);
      } catch (error) {
        console.error('Error fetching resume data:', error);
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
      const endpoints = ['10', '20', '30', '40', '10'];
      const titles = ['General', 'Recommended', 'Navy', 'Army', 'Air force'];
      const resumeTitles = ['Resume watching'];

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
    fetchResumeData(); // Fetch resume data

    const handleRefresh = () => {
      fetchMovieData(true); // Force background reload
      fetchTitleCardsData(true);
      fetchResumeData(); // Refresh resume data
    };

    window.addEventListener('popstate', handleRefresh);

    return () => {
      window.removeEventListener('popstate', handleRefresh);
    };
  }, []);

  useEffect(() => {
    if (movieList.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentMovieIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % movieList.length;
          setMovieData(movieList[nextIndex]);
          return nextIndex;
        });
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [movieList]);

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
    const idleInterval = setInterval(() => {
      callReloadDiskAPI();
    }, resetInterval);

    return () => clearInterval(idleInterval);
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
                    id: movieData.id,
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
        {/* <ResumeWatch /> Add ResumeWatch card */}
        {Object.keys(titleCardsData).map((title, idx) => (
          <TitleCards key={idx} title={title} movies={titleCardsData[title]} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
