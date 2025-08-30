import Book from '../models/Book.js';
import Category from '../models/Category.js';

// Get all books with optional filtering
export const getBooks = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (category) {
      const categoryDoc = await Category.findOne({ name: new RegExp(category, 'i') });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') }
      ];
    }
    
    const books = await Book.find(query)
      .populate('category', 'name')
      .populate('uploadedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Book.countDocuments(query);
    
    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('category', 'name')
      .populate('uploadedBy', 'name');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new book
export const createBook = async (req, res) => {
  try {
    const { title, author, description, category, publishedYear, pages, isbn } = req.body;
    
    // Debug: Log what's being received
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    // Validate required fields
    if (!title || !author || !description || !category) {
      return res.status(400).json({ message: 'Title, author, description, and category are required' });
    }
    
    // Validate files
    if (!req.files?.coverImage || !req.files?.pdfFile) {
      return res.status(400).json({ message: 'Both cover image and PDF file are required' });
    }
    
    let categoryDoc = await Category.findOne({ name: new RegExp('^' + category + '$', 'i') });
    
    if (!categoryDoc && req.user.role === 'admin') {
      categoryDoc = await Category.create({ name: category });
    } else if (!categoryDoc) {
      return res.status(400).json({ message: 'Category does not exist' });
    }
    
    // Handle file uploads
    const coverImageUrl = `/uploads/${req.files.coverImage[0].filename}`;
    const pdfUrl = `/uploads/${req.files.pdfFile[0].filename}`;
    
    const book = await Book.create({
      title,
      author,
      description,
      category: categoryDoc._id,
      publishedYear: publishedYear || undefined,
      pages: pages || undefined,
      isbn: isbn || undefined,
      coverImageUrl,
      pdfUrl,
      uploadedBy: req.user._id
    });
    
    const populatedBook = await Book.findById(book._id)
      .populate('category', 'name')
      .populate('uploadedBy', 'name');
    
    res.status(201).json(populatedBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a book
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name').populate('uploadedBy', 'name');
    
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }
    
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

