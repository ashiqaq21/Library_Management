import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import './style/BookListPage.css'; // Add styles here or create a separate CSS file
import './style/search.css'; // Add styles here or create a separate CSS file

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Function to fetch all books (without filters)
  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/books/');
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data); // Initially, set filteredBooks as all books
    } catch (error) {
      setError('Error fetching books.');
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle book search and apply filters
  const handleSearch = () => {
    let results = books;

    // Apply search query filter (by title or author)
    if (searchQuery) {
      results = results.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply genre filter
    if (genreFilter !== 'All') {
      results = results.filter((book) => book.genre === genreFilter);
    }

    // Apply availability filter
    if (availabilityFilter !== 'All') {
      results = results.filter((book) => book.availability_status === availabilityFilter);
    }

    setFilteredBooks(results); // Update the filtered books
  };

  // Function to issue a book
  const issueBook = async (bookId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user_id;

    const response = await fetch('http://localhost:8000/api/issuebooks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        book_id: bookId,
        user_id: userId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`Book issued successfully! Due date: ${data.due_date}`);
      fetchBooks();
    } else {
      alert(data.error || 'Failed to issue book. Please try again.');
    }
  };

  // Fetch books when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="BookListPage">
      <h2>Book List</h2>

      {/* Search and Filter Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select onChange={(e) => setGenreFilter(e.target.value)} value={genreFilter}>
          <option value="All">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          {/* Add other genres as needed */}
        </select>

        <select onChange={(e) => setAvailabilityFilter(e.target.value)} value={availabilityFilter}>
          <option value="All">All Availability</option>
          <option value="Available">Available</option>
          <option value="Issued">Issued</option>
        </select>
        <button onClick={handleSearch}>Search</button>

      </div>

      {/* Display Filtered Books */}
      <div className="book-card-container">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <img
                src={
                  book.cover_image
                    ? book.cover_image.startsWith('http')
                      ? book.cover_image
                      : `http://localhost:8000${book.cover_image}`
                    : 'fallback-image-url.jpg' // Replace with your fallback image URL
                }
                alt={`${book.title} cover`}
                className="book-cover"
              />
              <div className="book-details">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>Publication Date:</strong> {book.publication_date}</p>
                <p><strong>Status:</strong> {book.availability_status}</p>
                <button
                  onClick={() => issueBook(book.id)}
                  disabled={book.availability_status !== 'Available'}
                >
                  {book.availability_status === 'Available' ? 'Issue' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No books found with the given filters.</p>
        )}
      </div>
    </div>
  );
}

export default BookListPage;
