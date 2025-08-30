import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import { librarianService } from "../../Services/LibrarinasServices";
import { bookService } from "../../Services/bookService";
import { FaBookOpen } from "react-icons/fa";

// Import icons
import { FaEye, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      let data;
      try {
        data = await librarianService.getMyBooks();
      } catch {
        data = await bookService.getBooks({ uploadedBy: "me" });
      }

      let booksData = [];
      if (data?.data?.books) booksData = data.data.books;
      else if (data?.books) booksData = data.books;
      else if (Array.isArray(data)) booksData = data;
      else if (data?.records) booksData = data.records;

      setBooks(booksData || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to load books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await librarianService.deleteMyBook(bookId);
      setBooks((prev) => prev.filter((book) => book._id !== bookId));
    } catch {
      alert("Failed to delete book");
    }
  };

  const handleToggleAvailability = async (bookId, currentStatus) => {
    try {
      await librarianService.updateMyBook(bookId, {
        isAvailable: !currentStatus,
      });
      setBooks((prev) =>
        prev.map((book) =>
          book._id === bookId ? { ...book, isAvailable: !currentStatus } : book
        )
      );
    } catch {
      console.error("Error updating book");
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headers = [
    "Cover",
    "Title",
    "Author",
    "Category",
    "Status",
    "Views",
    "Actions",
  ];

  const getImageUrl = (book) => {
    const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    if (book.coverImageUrl) {
      return book.coverImageUrl.startsWith("http")
        ? book.coverImageUrl
        : `${baseURL}${book.coverImageUrl.startsWith("/") ? "" : "/"}${
            book.coverImageUrl
          }`;
    }
    if (book.coverImage) {
      return book.coverImage.startsWith("http")
        ? book.coverImage
        : `${baseURL}${book.coverImage.startsWith("/") ? "" : "/"}${
            book.coverImage
          }`;
    }
    return "/placeholder-book.jpg";
  };

  const renderRow = (book) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    const openPdf = () => {
      const pdfPath = book.pdfUrl;
      if (!pdfPath) return;
      const url = pdfPath.startsWith("http")
        ? pdfPath
        : `${BASE_URL}${pdfPath.startsWith("/") ? "" : "/"}${pdfPath}`;
      window.open(url, "_blank");
    };

    return (
      <tr key={book._id} className="table-row">
        <td className="px-6 py-4">
          <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
            <img
              src={getImageUrl(book)}
              alt={book.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = "📖";
              }}
            />
          </div>
        </td>

        <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
        <td className="px-6 py-4 text-gray-900">{book.author}</td>

        <td className="px-6 py-4">
          <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
            {book.category?.name || book.category}
          </span>
        </td>

        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              book.isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {book.isAvailable ? "Available" : "Borrowed"}
          </span>
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">{book.views || 0}</td>

        <td className="px-6 py-4 space-x-3 flex items-center">
          {/* View PDF */}
          <button
            onClick={openPdf}
            className="text-primary-600 hover:text-primary-900"
            title="Open PDF"
          >
            <FaEye />
          </button>

          {/* Toggle Availability */}
          <button
            onClick={() => handleToggleAvailability(book._id, book.isAvailable)}
            className="text-indigo-600 hover:text-indigo-900"
            title={book.isAvailable ? "Mark Borrowed" : "Mark Available"}
          >
            {book.isAvailable ? <FaTimesCircle /> : <FaCheckCircle />}
          </button>

          {/* Delete */}
          <button
            onClick={() => handleDeleteBook(book._id)}
            className="text-red-600 hover:text-red-900"
            title="Delete Book"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            My Uploaded Books
          </h1>
          <Link to="/librarian/upload" className="btn-primary flex items-center gap-2">
            <MdOutlineLibraryAdd /> Upload New Book
          </Link>
        </div>
        <div className="card flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Uploaded Books</h1>

        <div className="flex gap-4">
          <div className="w-64">
            <input
              type="text"
              placeholder="Search my books..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link to="/librarian/upload" className="btn-primary flex items-center gap-2">
            <MdOutlineLibraryAdd /> Upload New Book
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Total books: {books.length} | Showing: {filteredBooks.length}
          </p>
          <button onClick={fetchMyBooks} className="btn-secondary text-sm">
            Refresh Books
          </button>
        </div>

        <Table
          headers={headers}
          data={filteredBooks}
          renderRow={renderRow}
          emptyMessage={
            <div className="text-center py-12 ">
              <div className="text-6xl mb-4 flex justify-center items-center">
                <FaBookOpen className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No books uploaded yet
              </h3>
              <p className="text-gray-600 mb-4">Start by uploading your first book</p>
              <Link to="/librarian/upload" className="btn-primary flex justify-center items-center w-[250px] h-[48px] mt-[25px] ml-[450px] gap-2">
                <MdOutlineLibraryAdd /> Upload Book
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default MyBooks;
