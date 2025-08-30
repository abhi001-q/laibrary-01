import { useState, useRef } from "react";
import { FaCloudUploadAlt, FaCheckCircle, FaTimes } from "react-icons/fa";

const FileUploader = ({
  onFileSelect,
  accept = ".pdf",
  label = "Upload PDF",
  id = "file-upload",
  disabled = false,
}) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (accept === "image/*" && !selectedFile.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
      if (accept === ".pdf" && selectedFile.type !== "application/pdf") {
        alert("Please select a valid PDF file.");
        return;
      }

      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
        disabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
          : "border-gray-300 hover:border-gray-400 cursor-pointer"
      }`}
      onDrop={disabled ? undefined : handleDrop}
      onDragOver={disabled ? undefined : handleDragOver}
      onDragEnter={disabled ? undefined : handleDragOver}
    >
      <div className="space-y-1 text-center">
        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor={id}
            className={`relative bg-white rounded-md font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 ${
              disabled
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer text-primary-600 hover:text-primary-500"
            }`}
          >
            <span>{label}</span>
            <input
              id={id}
              name={id}
              type="file"
              className="sr-only"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={accept}
              disabled={disabled}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">
          {accept === "image/*"
            ? "Images (JPG, PNG, GIF)"
            : accept === ".pdf"
            ? "PDF files only"
            : accept}{" "}
          files only
        </p>
        {file && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-green-800 font-medium flex items-center">
                  <FaCheckCircle className="w-4 h-4 mr-1" />
                  File Selected
                </p>
                <p className="text-xs text-green-600">{file.name}</p>
                <p className="text-xs text-green-600">
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  onFileSelect(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
