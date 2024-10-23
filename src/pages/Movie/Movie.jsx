import React, {useEffect, useRef, useState} from 'react'
import './Movie.css'
import cards_data from '../../assets/Cards/cards';
import {Link} from  'react-router-dom'

const Movie = ({title, category}) => {
    const [apiData, setApiData] = useState([]);
    const cardsRef = useRef();
  
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzYyNzI1N2VhNDM5N2IyM2EzN2FhYTI0ZGMyNWY3OCIsIm5iZiI6MTcyOTQ2NzUwNC41Njk3NDksInN1YiI6IjY3MTU5Mzc1OTk0MzYzN2NlNTgyODBjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iGJHIOXTFRvQuNcaTxl26ZcI4XM6ZU72f5ueXjCMRdY'
      }
    };
  
    const handleWheel = (event) =>{
      event.preventDefault();
      cardsRef.current.scrollLeft += event.deltaY;
    }
    useEffect( ()=> {
      fetch(`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`, options)
      .then(response => response.json())
      .then(response => setApiData(response.results))
      .catch(err => console.error(err));
  
      cardsRef.current.addEventListener('wheel', handleWheel);
    },[])
    
  return (
    <div className='movie-cards'>
      <h2>{title?title: "Movies"}</h2>
      <div className="movie-list" ref={cardsRef}>
        {apiData.map((card, index)=>{
          return <Link to={`/player/${card.id}`} className="card" key={index}>
            <img src={`https://image.tmdb.org/t/p/w500`+card.backdrop_path} alt="" />
            <p>{card.original_title}</p>
          </Link>
        })}
      </div>
    </div>
  )
}

export default Movie
