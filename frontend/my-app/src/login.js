import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './style/Login.css';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.token);
        alert('Login successful');

        // Auto-refresh the page
        setTimeout(() => {
          if (result.is_admin) {
            // Navigate to AdminPage after successful login
            navigate('/adminpage');
          } else {
            // Navigate to UserPage after successful login
            navigate('/userpage');
          }
        }, 1000); // You can set the time for auto refresh here
      } else {
        const result = await response.json();
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Something went wrong! Please try again later.');
    }
  };

  return (
    <div className="LoginPage">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="navigation-links">
        <p>
          Don't have an account? <Link to="/signup">Login here</Link>.
        </p>
        <p>
          Want to explore? <Link to="/">Go to Home</Link>.
        </p>
      </div>
    
    </div>
  );
}

export default LoginPage;
