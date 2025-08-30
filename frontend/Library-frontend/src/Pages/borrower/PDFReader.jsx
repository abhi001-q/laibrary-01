import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { booksAPI } from "../../Services/api";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
} from "react-icons/fa";

// ✅ Worker setup (must have!)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFReader = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBook();
  }, [id]);

  const getPdfUrl = (pdfPath) => {
    if (!pdfPath) return "";
    if (pdfPath.startsWith("http")) {
      return pdfPath;
    }
    const apiBase =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const derivedBase = import.meta.env.VITE_BASE_URL
      ? import.meta.env.VITE_BASE_URL
      : apiBase.endsWith("/api")
      ? apiBase.slice(0, -4)
      : apiBase;
    return `${derivedBase}${pdfPath.startsWith("/") ? "" : "/"}${pdfPath}`;
  };

  const loadBook = async () => {
    try {
      const bookData = await booksAPI.getBookById(id);
      if (bookData.pdfUrl) {
        bookData.pdfUrl = getPdfUrl(bookData.pdfUrl);
      }
      setBook(bookData);
    } catch (err) {
      setError("Failed to load book");
      console.error("Error loading book:", err);
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
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

  if (!book || !book.pdfUrl) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <p className="text-gray-500">PDF not available for this book</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">{book.title}</h1>
          <p className="text-sm text-gray-600">by {book.author}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <FaSearchMinus className="w-5 h-5" />
            </button>

            <span className="text-sm text-gray-600">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={zoomIn}
              disabled={scale >= 3.0}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <FaSearchPlus className="w-5 h-5" />
            </button>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm text-gray-600">
              Page {pageNumber} of {numPages || "--"}
            </span>

            <button
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        <div className="flex justify-center p-4">
          <Document
            file={book.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error("PDF Load Error:", error);
              setError("Failed to load PDF. Check URL or server.");
            }}
            loading={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="ml-4 text-gray-600">Loading PDF...</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;
