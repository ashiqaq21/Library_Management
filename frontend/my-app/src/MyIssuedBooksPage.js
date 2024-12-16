import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import './style/BookListPage.css'; // Add styles here or create a separate CSS file
function MyIssuedBooksPage() {
  const [books, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      alert('Invalid or missing token. Please log in again.');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user_id);
    } catch (error) {
      console.error('Error decoding token:', error);
      alert('Invalid token. Please log in again.');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchIssuedBooks = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/myissuebooks/${userId}/`, {
            method: 'GET',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setIssuedBooks(data);
          } else {
            setError('Failed to fetch issued books.');
          }
        } catch (error) {
          setError('Error fetching issued books.');
          console.error('Error fetching issued books:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchIssuedBooks();
    }
  }, [userId]);

  const returnBook = async (issueId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/returnbook/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          IssueId: issueId,
        }),
      });

      if (response.ok) {
        alert('Book returned successfully!');
        setIssuedBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === issueId ? { ...book, status: 'Returned' } : book
          )
        );
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to return the book.');
      }
    } catch (error) {
      alert('Error processing the return request.');
      console.error('Error returning book:', error);
    }
  };

  if (!userId) {
    return <div>Please log in to view your issued books.</div>;
  }

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
                  book.book.cover_image
                    ? book.book.cover_image.startsWith('http')
                      ? book.book.cover_image
                      : `http://localhost:8000${book.book.cover_image}`
                    : 'fallback-image-url.jpg' // Replace with your fallback image URL
                }
                alt={`${book.title} cover`}
                className="book-cover"
              />
              <div className="book-details">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.book.author}</p>
                <p><strong>Genre:</strong> {book.book.genre}</p>
                <p><strong>Publication Date:</strong> {book.book.publication_date}</p>
                <p><strong>Status:</strong> {book.book.availability_status}</p>
                <button
                  onClick={() => returnBook(book.id)}
                  disabled={book.status == 'Returned'}
                >
               Return
                </button>
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
export default MyIssuedBooksPage;
