import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import FileUploader from "../../components/FileUploader";
import { booksAPI } from "../../Services/api";
import { useNotifications } from "../../context/NotificationContext";

const UploadBook = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    publishedYear: "",
    pages: "",
    isbn: "",
    quantityAvailable: "1",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Thriller",
    "Romance",
    "Biography",
    "History",
    "Science",
    "Technology",
    "Philosophy",
    "Psychology",
    "Self-Help",
    "Business",
    "Economics",
    "Art",
    "Music",
    "Travel",
    "Cooking",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCoverImageSelect = (file) => {
    console.log("Cover image selected:", file);

    // Check file size (max 10MB for images)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("Cover image is too large. Maximum size is 10MB.");
      return;
    }

    setCoverImage(file);
  };

  const handlePdfFileSelect = (file) => {
    console.log("PDF file selected:", file);

    // Check file size (max 50MB for PDFs)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert("PDF file is too large. Maximum size is 50MB.");
      return;
    }

    setPdfFile(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (!coverImage) {
      newErrors.coverImage = "Cover image is required";
    } else if (!coverImage.type.startsWith("image/")) {
      newErrors.coverImage = "Please select a valid image file";
    }

    if (!pdfFile) {
      newErrors.pdfFile = "PDF file is required";
    } else if (pdfFile.type !== "application/pdf") {
      newErrors.pdfFile = "Please select a valid PDF file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      const uploadData = new FormData();

      // Append form data
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          uploadData.append(key, formData[key]);
        }
      });

      // Append files
      uploadData.append("coverImage", coverImage);
      uploadData.append("pdfFile", pdfFile);

      // Debug: Log what's being sent
      console.log("Form data:", formData);
      console.log("Cover image:", coverImage);
      console.log("PDF file:", pdfFile);

      // Log FormData contents
      for (let [key, value] of uploadData.entries()) {
        console.log(`${key}:`, value);
      }

      await booksAPI.createBook(uploadData);

      // Send notification to borrowers about the new book
      addNotification({
        type: 'book',
        title: 'New Book Available!',
        message: `"${formData.title}" by ${formData.author} has been added to the library and is now available for borrowing.`,
        persistent: true
      });

      alert("Book uploaded successfully!");
      navigate("/librarian/books");
    } catch (error) {
      console.error("Error uploading book:", error);

      let errorMessage = "Failed to upload book. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific error types
      if (error.code === "ECONNABORTED") {
        errorMessage =
          "Upload timed out. Please check your connection and try again.";
      } else if (error.response?.status === 413) {
        errorMessage = "File too large. Please check file sizes and try again.";
      } else if (error.response?.status === 400) {
        errorMessage =
          error.response.data.message ||
          "Invalid data. Please check your inputs and try again.";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload New Book</h1>
          <p className="text-gray-600 mt-2">
            Add a new book to the library collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                className="input-field"
                placeholder="Enter book title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                className="input-field"
                placeholder="Enter author name"
                value={formData.author}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                className="input-field"
                value={formData.category}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Published Year
              </label>
              <input
                type="number"
                name="publishedYear"
                className="input-field"
                placeholder="e.g., 2023"
                min="1000"
                max={new Date().getFullYear()}
                value={formData.publishedYear}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Pages
              </label>
              <input
                type="number"
                name="pages"
                className="input-field"
                placeholder="e.g., 250"
                min="1"
                value={formData.pages}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                className="input-field"
                placeholder="Enter ISBN"
                value={formData.isbn}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity Available *
              </label>
              <input
                type="number"
                name="quantityAvailable"
                className="input-field"
                placeholder="e.g., 5"
                min="1"
                max="999"
                value={formData.quantityAvailable}
                onChange={handleInputChange}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of copies available for borrowing
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              className="input-field"
              placeholder="Enter book description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image *
              </label>
              <FileUploader
                onFileSelect={handleCoverImageSelect}
                accept="image/*"
                label="Upload Cover Image"
                id="cover-image-upload"
                disabled={loading}
              />
              {errors.coverImage && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaExclamationTriangle className="w-4 h-4 mr-1" />
                  {errors.coverImage}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File *
              </label>
              <FileUploader
                onFileSelect={handlePdfFileSelect}
                accept=".pdf"
                label="Upload PDF"
                id="pdf-file-upload"
                disabled={loading}
              />
              {errors.pdfFile && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaExclamationTriangle className="w-4 h-4 mr-1" />
                  {errors.pdfFile}
                </p>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/librarian/books")}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadBook;
