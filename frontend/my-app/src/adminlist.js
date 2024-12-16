import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import './style/BookListPage.css'; // Add styles here or create a separate CSS file

function AdminListPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/books/');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setError('Error fetching books.');
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="BookListPage">
      <h2>Book List</h2>
      <div className="book-card-container">
        {books.length > 0 ? (
          books.map((book) => (
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
               
              </div>
            </div>
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>
    </div>
  );
}

export default AdminListPage;
