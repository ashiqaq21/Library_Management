import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Routes and Route from react-router-dom
import BookList from './BookListPage';
import MyIssuedBooks from './MyIssuedBooksPage';  // Assuming you have a MyIssuedBooks component
import LoginPage from './login';  // Assuming you have a Login component
import Signup from './signup';  // Assuming you have a Signup component
import HomePage from './homepage';  // Assuming you have a HomePage component
import Admin from './admin';  // Assuming you have an Admin component
import MainPage from './mainpage';  // MainPage without Navbar
import Navbar from './Navbar';
import AddBookForm from './addbook';
import AdminListPage from './adminlist';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* MainPage does not have the Navbar */}
        <Route path="/" element={<MainPage />} />

        {/* Login and Signup routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin page with Navbar */}
        <Route path="/adminpage" element={<><Admin /></>} />

        {/* Other routes include the Navbar */}
        <Route path="/booklist" element={<><Navbar /><BookList /></>} />
        <Route path="/addbook" element={<><AddBookForm /></>} />
        <Route path="/adminlist" element={<><AdminListPage /></>} />
        <Route path="/myissuedbooks" element={<><Navbar /><MyIssuedBooks /></>} />
        <Route path="/userpage" element={<><Navbar /><HomePage /></>} />
      </Routes>
    </Router>
  );
};

export default App;
