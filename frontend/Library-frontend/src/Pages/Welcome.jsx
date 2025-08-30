import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-6">📚</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Library Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Welcome to our digital library platform. Discover, read, and manage thousands of books
            with our comprehensive library management system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 transition duration-300"
            >
              Register
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">👤</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Readers</h3>
              <p className="text-gray-600">
                Browse and read thousands of books, manage your reading history, and discover new favorites.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Librarians</h3>
              <p className="text-gray-600">
                Upload and manage your book collections, track borrowing activity, and connect with readers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Administrators</h3>
              <p className="text-gray-600">
                Oversee the entire library system, manage users, and maintain the platform efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
