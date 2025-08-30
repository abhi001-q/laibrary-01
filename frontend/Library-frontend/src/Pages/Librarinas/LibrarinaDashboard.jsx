import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatsCard from "../../components/StatsCard";
import { getImageUrl } from "../../utils/imageUtils";
import { librarianAPI } from "../../Services/api";
import { SiBookstack } from "react-icons/si";
import { FaCheck, FaSync, FaEye } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

const LibrarianDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentBooks, setRecentBooks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, myBooksData] = await Promise.all([
        librarianAPI.getDashboard(),
        librarianAPI.getMyBooks({ page: 1, limit: 5 }),
      ]);

      const books = Array.isArray(myBooksData?.books)
        ? myBooksData.books
        : Array.isArray(myBooksData)
        ? myBooksData
        : [];

      const totalViews = books.reduce(
        (sum, book) => sum + (book.views || 0),
        0
      );
      const totalBooks =
        typeof statsData?.totalBooks === "number"
          ? statsData.totalBooks
          : books.length;
      const borrowedBooks =
        typeof statsData?.totalBorrowed === "number"
          ? statsData.totalBorrowed
          : books.filter((b) => !b.isAvailable).length;
      const availableBooks = Math.max(0, totalBooks - borrowedBooks);

      setStats({
        totalBooks,
        availableBooks,
        borrowedBooks,
        totalViews,
      });

      setRecentBooks(books);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<SiBookstack className="w-10 h-10 text-indigo-600" />}
          color=""
        />
        <StatsCard
          title="Available"
          value={stats.availableBooks}
          icon={<FaCheck className="w-10 h-10 text-green-600" />}
          color=""
        />
        <StatsCard
          title="Borrowed"
          value={stats.borrowedBooks}
          icon={<FaBookOpen className="w-10 h-10 text-orange-600" />}
          color=""
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews}
          icon={<FaEye className="w-10 h-10 text-purple-600" />}
          color=""
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/librarian/upload"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer text-center "
        >
          <div className="text-3xl mb-3 flex justify-center items-center">
            <FaUpload className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Upload New Book</h3>
          <p className="text-sm text-gray-600">Add a new book to the library</p>
        </Link>

        <Link
          to="/librarian/books"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer text-center"
        >
          <div className="text-3xl mb-3 flex justify-center items-center">
            <SiBookstack className="w-10 h-10 text-indigo-600 " />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage My Books</h3>
          <p className="text-sm text-gray-600">
            View and manage your uploaded books
          </p>
        </Link>
      </div>

      {/* Recent Books */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Recently Uploaded Books
          </h2>
          <Link
            to="/librarian/books"
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            View all →
          </Link>
        </div>

        {recentBooks && recentBooks.length > 0 ? (
          <div className="space-y-4">
            {recentBooks &&
              recentBooks.map((book) => (
                <div
                  key={book._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={getImageUrl(book, "book") || "/placeholder-book.jpg"}
                      alt={book.title}
                      className="h-12 w-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-book.jpg";
                      }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        book.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.isAvailable ? "Available" : "Borrowed"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {book.views || 0} views
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 flex justify-center items-center">
              <FaBookOpen className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books uploaded yet
            </h3>
            <p className="text-gray-600">Start by uploading your first book</p>
            <Link
              to="/librarian/upload"
              className="btn-primary mt-4 inline-block"
            >
              Upload Book
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarianDashboard;
