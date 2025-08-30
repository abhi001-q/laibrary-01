import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookService } from "../../Services/bookService";
import { FaCalendar, FaRedo, FaBook, FaEye, FaBookOpen } from "react-icons/fa";
import { getImageUrl } from "../../utils/imageUtils";
import { booksAPI } from "../../Services/api";

const MyLibrary = () => {
  const [readingHistory, setReadingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadReadingHistory();
  }, [currentPage]);

  const loadReadingHistory = async () => {
    try {
      const response = await bookService.getReadingHistory({
        page: currentPage,
        limit: 10,
      });

      console.log("=== MY LIBRARY API RESPONSE DEBUG ===");
      console.log("Full reading history response:", response);

      let records = [];
      // Handle different response structures
      if (response && response.data) {
        // If response has data property
        records = response.data.records || response.data || [];
        setTotalPages(response.data.totalPages || 1);
      } else if (response && response.records) {
        // If response has records property directly
        records = response.records || [];
        setTotalPages(response.totalPages || 1);
      } else {
        // Fallback - treat response as array
        records = Array.isArray(response) ? response : [];
        setTotalPages(1);
      }

      console.log("Processed records:", records);
      if (records.length > 0) {
        console.log("First record sample:", records[0]);
        console.log("First record book data:", records[0]?.book);
        if (records[0]?.book) {
          console.log("First book cover fields:", {
            coverImageUrl: records[0].book.coverImageUrl,
            coverImage: records[0].book.coverImage,
            image: records[0].book.image,
          });
          console.log("Constructed image URL:", getImageUrl(records[0].book));
        }
      }

      // Enrich records: if book is an ID string, fetch full book details
      const enriched = await Promise.all(
        records.map(async (rec) => {
          if (rec && rec.book && typeof rec.book === "string") {
            try {
              const book = await booksAPI.getBookById(rec.book);
              return { ...rec, book };
            } catch (e) {
              console.warn("Failed to populate book for record", rec._id, e);
              return rec;
            }
          }
          return rec;
        })
      );

      setReadingHistory(enriched);
    } catch (error) {
      console.error("Full error object:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load reading history";
      console.error("Error loading reading history:", errorMessage);
      setReadingHistory([]); // Set empty array on error
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (recordId) => {
    try {
      await bookService.returnBook(recordId);
      alert("Book returned successfully!");
      loadReadingHistory(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.message || "Failed to return book");
    }
  };

  const buildPdfUrl = (pdfPath) => {
    if (!pdfPath) return "";
    const apiBase =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const baseURL = import.meta.env.VITE_BASE_URL
      ? import.meta.env.VITE_BASE_URL
      : apiBase.endsWith("/api")
      ? apiBase.slice(0, -4)
      : apiBase;
    const url = pdfPath.startsWith("http")
      ? pdfPath
      : `${baseURL}${pdfPath.startsWith("/") ? "" : "/"}${pdfPath}`;
    return url;
  };

  const openPdfInNewTab = (pdfPath) => {
    const url = buildPdfUrl(pdfPath);
    if (!url) return;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  // Improved image error handler
  const handleImageError = (e, book) => {
    console.log("Image failed to load:", {
      originalSrc: e.target.src,
      book: book,
      constructedUrl: getImageUrl(book, "cover"),
    });
    
    // Hide the broken image
    e.target.style.display = "none";
    
    // Create a fallback element
    const fallback = document.createElement("div");
    fallback.className = "w-full h-full flex items-center justify-center text-gray-400";
    fallback.innerHTML = '<span class="text-2xl">📖</span>';
    
    // Replace the image with fallback
    e.target.parentElement.appendChild(fallback);
  };

  // Function to get fallback image URL
  const getBookCoverUrl = (book) => {
    if (!book) return null;
    
    // Try multiple potential image sources
    const possibleSources = [
      book.coverImageUrl,
      book.coverImage,
      book.image,
      book.cover,
      book.thumbnail
    ];
    
    for (const source of possibleSources) {
      if (source && typeof source === 'string' && source.trim()) {
        return getImageUrl({ ...book, coverImageUrl: source }, "cover");
      }
    }
    
    // If getImageUrl function exists, try it with the book object
    if (typeof getImageUrl === 'function') {
      const constructedUrl = getImageUrl(book, "cover");
      if (constructedUrl && constructedUrl !== '' && !constructedUrl.includes('undefined')) {
        return constructedUrl;
      }
    }
    
    return null;
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
        <h1 className="text-2xl font-bold text-gray-900">My Library</h1>
        <p className="mt-1 text-sm text-gray-600">
          Your reading history and borrowed books
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Reading History</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {readingHistory && readingHistory.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-6xl mb-4 flex justify-center items-center">
                <FaBookOpen className="w-10 h-10 mx-auto" />
              </div>
              <p className="text-gray-500">No reading history yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start borrowing books to see them here
              </p>
            </div>
          ) : (
            readingHistory &&
            readingHistory.map((record) => {
              const coverUrl = getBookCoverUrl(record.book);
              
              return (
                <div key={record._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={record.book?.title || 'Book cover'}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, record.book)}
                            onLoad={() => {
                              console.log("Image loaded successfully:", coverUrl);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-2xl">📖</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {record.book?.title || 'Unknown Title'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {record.book?.author || 'Unknown Author'}
                        </p>

                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <FaCalendar className="w-4 h-4 mr-1" />
                          Borrowed:{" "}
                          {new Date(record.borrowedDate).toLocaleDateString()}
                          {record.dueDate && (
                            <span className="ml-3">
                              Due: {new Date(record.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Action buttons */}
                      <div className="flex space-x-2">
                        {/* View button */}
                        <Link
                          to={record.book?._id ? `/book/${record.book._id}` : "#"}
                          className="btn-secondary flex items-center text-xs px-3 py-1"
                          onClick={(e) => {
                            if (!record.book?._id) e.preventDefault();
                          }}
                        >
                          <FaEye className="w-3 h-3 mr-1" />
                          View
                        </Link>

                        {/* Read now opens direct PDF link in new tab */}
                        {record.book?.pdfUrl && (
                          <a
                            href={buildPdfUrl(record.book.pdfUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary flex items-center text-xs px-3 py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaBook className="w-3 h-3 mr-1" />
                            Read
                          </a>
                        )}

                        {/* Return button - only for active borrows */}
                        {!record.returnedDate && (
                          <button
                            onClick={() => handleReturn(record._id)}
                            className="btn-primary flex items-center text-xs px-3 py-1"
                          >
                            <FaRedo className="w-3 h-3 mr-1" />
                            Return
                          </button>
                        )}
                      </div>

                      {/* Status badge */}
                      <div>
                        {record.returnedDate ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Returned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Borrowed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibrary;