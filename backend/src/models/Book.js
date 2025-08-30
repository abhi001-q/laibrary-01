import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  coverImageUrl: {
    type: String,
    default: ''
  },
  publishedYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear()
  },
  pages: {
    type: Number,
    min: 1
  },
  isbn: {
    type: String,
    trim: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
export default Book;