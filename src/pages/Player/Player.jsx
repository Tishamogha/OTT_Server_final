import React, { useEffect, useState } from 'react'
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams } from 'react-router-dom';

const Player = () => {

  const {id} = useParams();
  const navigate =useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    typeof: ""
  })
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzYyNzI1N2VhNDM5N2IyM2EzN2FhYTI0ZGMyNWY3OCIsIm5iZiI6MTcyOTQ2NzUwNC41Njk3NDksInN1YiI6IjY3MTU5Mzc1OTk0MzYzN2NlNTgyODBjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iGJHIOXTFRvQuNcaTxl26ZcI4XM6ZU72f5ueXjCMRdY'
    }
  };
  useEffect(()=>{
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
    .then(response => response.json())
    .then(response => setApiData(response.results[0]))
    .catch(err => console.error(err));

  },[])

  return (
    <div className='player'>
      <img src={back_arrow_icon} alt="" onClick={()=>{navigate(-1)}} />
      <iframe width='90%' height='90%' src={`http://www.youtube.com/embed/${apiData.key}`}
      title='trailer' frameBorder='0' allowFullScreen></iframe><br></br>
      <div className="player-info">
        <p className='a'>{apiData.published_at.slice(0,10)}</p>
        <p className='b'>{apiData.name}</p>
        <p className='c'>{apiData.type}</p>
      </div>
    </div> 
  )
}

export default Player
