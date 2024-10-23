import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import hero_banner from '../../assets/hero_banner1.jpg'
import play_icon from '../../assets/play_icon.png'
import info_icon from '../../assets/info_icon.png'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  return (
    <div className='home'>
      <Navbar />
      <div className="hero">
        <img src={hero_banner} alt="" className='banner-img' />
        <div className="hero-caption">
          <h2>Joker (2019)</h2>
          <p>Joker is a 2019 American psychological thriller film directed by Todd Phillips from a screenplay he co-wrote with Scott Silver. The film stars Joaquin Phoenix and is loosely based on DC Comics characters, including the Joker. 
            It follows Arthur Fleck, a failed clown and aspiring stand-up comedian whose descent into mental illness and nihilism culminates with the emergence of an alter-ego known as "Joker" and inspires a violent countercultural revolution against the wealthy in a decaying Gotham City. 
            </p>
            <div className="hero-btns">
              <button className='btn'><img src={play_icon} alt="" />Play</button>
              <button className='btn dark-btn'><img src={info_icon} alt="" />More Info</button>
            </div>

            <TitleCards />
        </div>
      </div>
      <div className="more-cards">
        <TitleCards title={"BlockBuster Movies"} category={"top_rated"} />
        <TitleCards title={"Only on BootStream"} category={"popular"}/>
        <TitleCards title={"Upcoming"} category={"upcoming"}/>
        <TitleCards title={"Top Picks for You"} category={"now_playing"}/>
      </div>
      <Footer />
    </div>
  )
}

export default Home
