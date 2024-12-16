import React from 'react';
import { Link } from 'react-router-dom';

function DashboardPage() {
  return (
    <div className="DashboardPage">
      <h1>Welcome to your Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/booklist">Book List</Link></li>
          <li><Link to="/my-issued-books">My Issued Books</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default DashboardPage;
