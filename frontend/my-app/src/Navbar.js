import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate hook
import './style/navbar.css'; // Add styles here or create a separate CSS file

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token.split('.').length === 3) {
      setIsLoggedIn(true); // Check if a valid token exists
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from localStorage
    setIsLoggedIn(false);
    navigate('/login'); // Use navigate for redirection
  };

  return (
    <nav className="navbar">
        <h3>  Welcome to the Library
        
        </h3>
      <ul>
        <li>
        </li>

       
          <>
            <li>
              <Link to="/booklist">Book List</Link>
            </li>
            <li>
              <Link to="/myissuedbooks">My Issued Books</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
       
       
      </ul>
    </nav>
  );
};

export default Navbar;
