import React, { useState, useEffect } from 'react';
import './style/HomePage.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);

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
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    setIsLoggedIn(false); // Reset login state
    setIsSuperUser(false); // Reset isSuperUser state
    window.location.href = '/'; // Redirect to Home
  };

  return (

      <div className="HomePage">
        <h1>Library Management System</h1>
        
          <ul>
          <>
            
          <li><Link to="/adminpage">Home</Link></li>
          
          <li><Link to="/adminlist">Book List</Link></li>
        
         <li><Link to="/addbook">Add Book</Link></li>
      
          {isLoggedIn && <li><button onClick={handleLogout}>Logout</button></li>} {/* Logout button */}
        
        
          </>
       
       
          </ul>
      
      
      </div>
    
  );
}

export default Admin;
