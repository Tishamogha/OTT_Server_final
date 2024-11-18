import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';  // Import Link and hooks
import './NewPage.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const NewPage = () => {
    return (
        <div className="search-page">
          <Navbar />
          <div className="search-content">
            
          </div>
          <Footer />
        </div>
      );
};
  

export default NewPage;
