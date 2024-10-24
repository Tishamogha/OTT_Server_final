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

  // Cache keys
  const heroCacheKey = 'moviesCache';
  const titleCardsCacheKey = 'titleCardsCache';

  const fetchMovieData = async () => {
    try {
      const response = await fetch(`${apiUrl}` + 6);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Cache the new data in local storage
      localStorage.setItem(heroCacheKey, JSON.stringify(data));

      // Set the list of movies and the initial movie
      setMovieList(data.cards);
      setMovieData(data.cards[0]); // Display the first movie initially
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  const fetchTitleCardsData = async () => {
    const endpoints = ['10', '20', '30', '40']; // Modify this as per your title card categories
    const titles = ['Critically Acclaimed Movies', 'Only on BootStream', 'Upcoming', 'Top Picks for You'];

    const titleCards = {};

    try {
      for (let i = 0; i < endpoints.length; i++) {
        const response = await fetch(`${apiUrl}${endpoints[i]}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Add the fetched data to the titleCards object
        titleCards[titles[i]] = data.cards;
      }

      // Cache the title cards data in local storage
      localStorage.setItem(titleCardsCacheKey, JSON.stringify(titleCards));

      // Set title cards data
      setTitleCardsData(titleCards);
    } catch (error) {
      console.error('Error fetching title cards data:', error);
    }
  };

  useEffect(() => {
    // Check local storage for cached data
    const cachedHeroData = JSON.parse(localStorage.getItem(heroCacheKey));
    const cachedTitleCardsData = JSON.parse(localStorage.getItem(titleCardsCacheKey));

    if (cachedHeroData) {
      setMovieList(cachedHeroData.cards);
      setMovieData(cachedHeroData.cards[0]);
      setLoading(false);
    } else {
      fetchMovieData();
    }

    if (cachedTitleCardsData) {
      setTitleCardsData(cachedTitleCardsData);
    } else {
      fetchTitleCardsData();
    }

    // Force a refresh on component mount
    const handleRefresh = () => {
      fetchMovieData();
      fetchTitleCardsData();
    };

    window.addEventListener('popstate', handleRefresh);

    // Cleanup the event listener on unmount
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
}

export default Home;
