import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { booksAPI, borrowerAPI } from "../../Services/api";
import { FaBookOpen, FaCalendar, FaUser } from "react-icons/fa";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getImageUrl = (book) => {
    const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    if (book?.coverImageUrl) {
      return book.coverImageUrl.startsWith("http")
        ? book.coverImageUrl
        : `${baseURL}${book.coverImageUrl.startsWith("/") ? "" : "/"}${book.coverImageUrl}`;
    }
    if (book?.coverImage) {
      return book.coverImage.startsWith("http")
        ? book.coverImage
        : `${baseURL}${book.coverImage.startsWith("/") ? "" : "/"}${book.coverImage}`;
    }
    return "";
  };

  const getPdfUrl = (book) => {
    const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    if (book?.pdfUrl) {
      return book.pdfUrl.startsWith("http")
        ? book.pdfUrl
        : `${baseURL}${book.pdfUrl.startsWith("/") ? "" : "/"}${book.pdfUrl}`;
    }
    return null;
  };

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      const bookData = await booksAPI.getBookById(id);
      setBook(bookData);
    } catch (err) {
      setError("Failed to load book details");
      console.error("Error loading book:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    try {
      const history = await borrowerAPI.getReadingHistory();
      const currentlyBorrowed = history.records?.filter(record => !record.returnedDate) || [];
      if (currentlyBorrowed.length >= 3) {
        alert("You have reached the maximum limit of 3 borrowed books. Please return a book first.");
        return;
      }

      await borrowerAPI.borrowBook(id);
      alert("Book borrowed successfully!");
      loadBook();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to borrow book";
      alert(errorMessage);
      console.error("Error borrowing book:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <p className="text-gray-500">Book not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                <img
                  src={getImageUrl(book)}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  style={{ minHeight: '256px', maxHeight: '256px', minWidth: '192px', maxWidth: '192px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="text-6xl text-gray-400">📖</div>';
                  }}
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {book.category?.name || book.category}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  book.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {book.isAvailable ? "Available" : "Borrowed"}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <FaUser className="w-5 h-5 mr-2" />
                  Uploaded by: {book.uploadedBy?.name}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendar className="w-5 h-5 mr-2" />
                  Added on: {new Date(book.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{book.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {book.isAvailable ? (
                  <button
                    onClick={handleBorrow}
                    className="btn-primary flex items-center"
                  >
                    <FaBookOpen className="w-5 h-5 mr-2" />
                    Borrow Book
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn-secondary opacity-50 cursor-not-allowed"
                  >
                    Currently Unavailable
                  </button>
                )}

                {/* Open PDF directly in new tab */}
                {book.pdfUrl && (
                  <a
                    href={getPdfUrl(book)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center"
                  >
                    Read Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
