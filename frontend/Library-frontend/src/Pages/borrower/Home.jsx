import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { booksAPI, borrowerAPI } from "../../Services/api";
import StatsCard from "../../components/StatsCard";
import { getImageUrl } from "../../utils/imageUtils";
import { SiBookstack } from "react-icons/si";
import { FaCheckCircle } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";

const BorrowerHome = () => {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
  });
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    loadBooks();
    loadStats();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await booksAPI.getBooks({ limit: 8 });
      console.log("=== BOOKS API RESPONSE DEBUG ===");
      console.log("Full API response:", data);
      console.log("Books array:", data.books);

      if (data.books && data.books.length > 0) {
        console.log("First book sample:", data.books[0]);
        console.log("First book cover image fields:", {
          coverImageUrl: data.books[0].coverImageUrl,
          coverImage: data.books[0].coverImage,
          image: data.books[0].image,
        });
      }

      setBooks(data.books);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const bookData = await booksAPI.getBooks();
      // Get current borrower's borrowed books count
      let borrowedCount = 0;
      try {
        const history = await borrowerAPI.getReadingHistory();
        borrowedCount =
          history.records?.filter((record) => !record.returnedDate).length || 0;
      } catch (err) {
        console.log("Could not load reading history", err);
      }

      setStats({
        totalBooks: bookData.total,
        availableBooks: bookData.books.filter((b) => b.isAvailable).length,
        borrowedBooks: borrowedCount,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleBorrowBook = async (bookId) => {
    try {
      // Check if user has reached the limit of 3 books
      const history = await borrowerAPI.getReadingHistory();
      const currentlyBorrowed =
        history.records?.filter((record) => !record.returnedDate) || [];

      if (currentlyBorrowed.length >= 3) {
        alert(
          "You have reached the maximum limit of 3 borrowed books. Please return a book before borrowing another."
        );
        return;
      }

      await borrowerAPI.borrowBook(bookId);
      alert("Book borrowed successfully!");

      // Refresh the data
      loadBooks();
      loadStats();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to borrow book";
      alert(errorMessage);
      console.error("Error borrowing book:", error);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to Our Library
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Discover and read thousands of books
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<SiBookstack className="w-10 h-10 text-indigo-600" />}
          color=""
        />
        <StatsCard
          title="Available Books"
          value={stats.availableBooks}
          icon={<FaCheckCircle className="w-10 h-10 text-green-600" />}
          color=""
        />
        <StatsCard
          title="My Borrowed Books"
          value={stats.borrowedBooks}
          icon={<FaUser className="w-10 h-10 text-purple-600" />}
          color=""
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-5 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Recently Added Books
          </h2>
          <Link
            to="/my-library"
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {books.map((book) => (
            <div
              key={book._id}
              className="group relative bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center overflow-hidden relative">
                <img
                  src={getImageUrl(book)}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to book emoji if image fails to load
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML =
                      '<div class="text-4xl text-gray-400 flex items-center justify-center h-full">📖</div>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                  <div className="w-full p-2 text-white">
                    <div
                      className="text-sm font-medium truncate"
                      title={book.title}
                    >
                      {book.title}
                    </div>
                    <div className="text-[11px] text-gray-200 truncate">
                      by {book.author}
                    </div>
                    <div className="flex gap-2 mt-1">
                      {book.isAvailable ? (
                        <>
                          <button
                            onClick={() => handleBorrowBook(book._id)}
                            className="btn-primary btn-xs text-xs py-1 px-2"
                          >
                            Borrow
                          </button>
                          <Link
                            to={`/book/${book._id}`}
                            className="btn-secondary btn-xs text-xs py-1 px-2"
                          >
                            View
                          </Link>
                        </>
                      ) : (
                        <button
                          disabled
                          className="btn-secondary btn-xs opacity-60 cursor-not-allowed text-xs py-1 px-2"
                        >
                          Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {books && books.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4 flex justify-center items-center">
              <FaBookOpen className="w-10 h-10 mx-auto" />
            </div>
            <p className="text-gray-500">No books available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowerHome;
