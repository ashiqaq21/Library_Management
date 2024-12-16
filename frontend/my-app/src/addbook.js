import React, { useState, useEffect } from 'react';
import './style/AddBookForm.css';

function AddBookForm() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publication_date: '',
    availability_status: 'Available', // Default value for availability status
    cover_image: null, // Add cover_image to formData
  });
  const [books, setBooks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editBookId, setEditBookId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      cover_image: file, // Update cover_image in formData
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode
      ? `http://localhost:8000/api/books/${editBookId}/`
      : 'http://localhost:8000/api/books/';

    const data = new FormData(); // Use FormData for file upload
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });

    try {
      const response = await fetch(url, {
        method,
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || 'Operation successful');
        fetchBooks(); 
        setEditMode(false);
        setFormData({
          title: '',
          author: '',
          genre: '',
          publication_date: '',
          availability_status: 'Available', // Reset to default
          cover_image: null, // Reset cover_image
        });
      } else {
        alert('Error: ' + result.detail);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/books/');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      publication_date: book.publication_date,
      availability_status: book.availability_status,
      cover_image: null, // Reset to null for new file uploads
    });
    setEditMode(true);
    setEditBookId(book.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/books/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Book deleted successfully');
        fetchBooks(); 
      } else {
        alert('Failed to delete the book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  useEffect(() => {
    fetchBooks(); // Fetch books when the component mounts
  }, []);

  return (
    <div className="AddBookForm">
      <h2>{editMode ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Author:
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Genre:
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Publication Date:
          <input
            type="date"
            name="publication_date"
            value={formData.publication_date}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Cover Image:
          <input
            type="file"
            name="cover_image"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
        <br />

        {/* Only show Availability Status field when in edit mode */}
        {editMode && (
          <>
            <label>
              Availability Status:
              <select
                name="availability_status"
                value={formData.availability_status}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Issued">Issued</option>
              </select>
            </label>
            <br />
          </>
        )}

        <button type="submit">{editMode ? 'Update Book' : 'Add Book'}</button>
      </form>

      <h2>View Books</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Publication Date</th>
            <th>Availability Status</th>
            <th>Cover Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.publication_date}</td>
                <td>{book.availability_status}</td>
                <td>
                  {book.cover_image && (
                    <img
                    src={
                      book.cover_image
                        ? book.cover_image.startsWith('http')
                          ? book.cover_image
                          : `http://localhost:8000${book.cover_image}`
                        : 'fallback-image-url.jpg' // Replace with your fallback image URL
                    }
                      alt={`${book.title} cover`}
                      style={{ width: '50px', height: 'auto' }}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(book)}>Edit</button>
                  <button onClick={() => handleDelete(book.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No books available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AddBookForm;
