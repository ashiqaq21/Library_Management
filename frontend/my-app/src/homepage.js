import React, { useState, useEffect } from 'react';
import './style/HomePage.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const navigate = useNavigate();

  // Function to manually decode JWT
  const decodeJWT = (token) => {
    const payload = token.split('.')[1]; // Get the payload part (second part of JWT)
    const decodedPayload = atob(payload.replace(/_/g, '/').replace(/-/g, '+')); // Base64url decode
    return JSON.parse(decodedPayload); // Parse as JSON
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // User is logged in
      try {
        const decodedToken = decodeJWT(token); // Decode token manually
        setIsSuperUser(decodedToken.is_superuser); // Set isSuperUser based on token

        if (decodedToken.is_superuser) {
          alert('Superuser login successful!'); // Show alert for superuser login
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }

    // Listen for changes in localStorage to auto-refresh the state
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('token');
      if (updatedToken) {
        setIsLoggedIn(true);
        try {
          const decodedToken = decodeJWT(updatedToken);
          setIsSuperUser(decodedToken.is_superuser);
        } catch (error) {
          console.error('Invalid token:', error);
        }
      } else {
        setIsLoggedIn(false);
        setIsSuperUser(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    setIsLoggedIn(false); // Reset login state
    setIsSuperUser(false); // Reset isSuperUser state
    navigate('/'); // Redirect to Home
  };

  return (
 
    <div className="HomePage">
      <h1>Library Management System</h1>
      
    </div>
  );
}

export default HomePage;
