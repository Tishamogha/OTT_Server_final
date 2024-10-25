import React from 'react'
import './Navbar.css'
import logo from '../../assets/BSLogo_transparent.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.png'
import profile_icon from '../../assets/profile_icon.png'
import caret_icon from '../../assets/caret_icon.png'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="navbar-left">
        <img src={logo} alt=""/>
        <ul>
          <li>Home</li>
          {/* <li>TV Shows</li> */}
          <li><Link to="/movies">Movies</Link></li>
          {/* <li>New & popular</li> */}
          {/* <li>My List</li> */}
        </ul>
      </div>
      <div className="navbar-right">
        <img src={search_icon} alt="" classname='icons' />
        <p>Children</p>
        <img src={bell_icon} alt="" className='icons' />
        <div className="navbar-profile">
          <img src={profile_icon} alt="" className='profile'/>
          <img src={caret_icon} alt="" className=''/>
          <div className="dropdown">
            <p>Sign out of BootStream</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
