import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/BSLogo_transparent.png';
import search_icon from '../../assets/search_icon.svg';
import bell_icon from '../../assets/bell_icon.png';
import profile_icon from '../../assets/profile_icon.png';
import caret_icon from '../../assets/caret_icon.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [username, setUsername] = useState("");

  const authenticate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await response.json();

      if (data.status === "OK") {
        alert("Authentication successful");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/'); // Redirect to the home page on successful authentication
        return true; // Return true if authentication is successful
      } else {
        alert("Authentication failed.");
        return false; // Return false if authentication fails
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      return false; // Return false in case of an error
    }
  };

  const handleAuthentication = async () => {
    const isAuthenticated = await authenticate();
    if (isAuthenticated) {
      console.log("User is authenticated");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser); // Parse the JSON string
        setUsername(parsedUser.username); // Access the username property
      }
    } else {
      console.log("Authentication failed");
      navigate('/Login'); // Redirect to the home page on successful authentication
    }
  };


  useEffect(() => {


    handleAuthentication()

  }, []);


  return (
    <div className='navbar'>
      <div className="navbar-left">
        <img src={logo} alt="Logo" />
        <ul>
          <li>Home</li>
          <li><Link to="/movies">Movies</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <img src={search_icon} alt="Search Icon" className='icons' />
        <p>Children</p>
        <img src={bell_icon} alt="Notifications" className='icons' />
        <div className="navbar-profile">
          <img src={profile_icon} alt="Profile Icon" className='profile' />
          <img src={caret_icon} alt="Caret Icon" />
          <div className="dropdown">
            {username ? <span>{username}</span> : <Link to="/Login">Sign in</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
