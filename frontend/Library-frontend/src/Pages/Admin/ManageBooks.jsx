import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../Services/adminServices";
import Table from "../../components/Table";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { getImageUrl } from "../../utils/imageUtils";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getAllBooks({
        page: currentPage,
        limit: 10,
      });

      console.log("API Response:", response); // Debug log

      // Handle different response structures
      if (response && response.data) {
        // If response has data property
        setBooks(response.data.books || response.data || []);
        setTotalPages(response.data.totalPages || 1);
      } else if (response && response.books) {
        // If response has books property directly
        setBooks(response.books || []);
        setTotalPages(response.totalPages || 1);
      } else {
        // Fallback - treat response as array
        setBooks(Array.isArray(response) ? response : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Full error object:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      console.error("Error loading books:", errorMessage);
      setError(errorMessage);
      setBooks([]); // Set empty array on error
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleEdit = (bookId) => {
    navigate(`/admin/edit-book/${bookId}`);
  };

  const handleDelete = useCallback(
    async (bookId) => {
      if (!window.confirm("Are you sure you want to delete this book?")) {
        return;
      }

      try {
        await adminService.deleteBook(bookId);
        alert("Book deleted successfully!");
        loadBooks(); // Refresh the list
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete book");
      }
    },
    [loadBooks]
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const headers = [
    "Title",
    "Author",
    "Category",
    "Status",
    "Uploaded By",
    "Actions",
  ];

  const renderRow = useCallback(
    (book) => {
      const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
      const coverUrl = getImageUrl(book, "book");
      const openPdf = () => {
        const pdfPath = book.pdfUrl;
        if (!pdfPath) return;
        const url = pdfPath.startsWith("http")
          ? pdfPath
          : `${BASE_URL}${pdfPath.startsWith("/") ? "" : "/"}${pdfPath}`;
        window.open(url, "_blank");
      };
      return (
        <tr key={book._id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={book.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <span className="text-sm">📖</span>
                )}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {book.title}
                </div>
              </div>
            </div>
          </td>

          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{book.author}</div>
          </td>

          <td className="px-6 py-4 whitespace-nowrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {book.category?.name || book.category}
            </span>
          </td>

          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                book.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {book.isAvailable ? "Available" : "Borrowed"}
            </span>
          </td>

          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{book.uploadedBy?.name}</div>
          </td>

          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center space-x-2">
              <button
                onClick={openPdf}
                className="text-blue-600 hover:text-blue-900"
                title="Open PDF"
              >
                <FaEye className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleEdit(book._id)}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaEdit className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(book._id)}
                className="text-red-600 hover:text-red-900"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      );
    },
    [handleDelete, handleEdit]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load books
        </h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage all books in the library
          </p>
        </div>
      </div>

      <Table
        headers={headers}
        data={books}
        renderRow={renderRow}
        emptyMessage="No books found"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
