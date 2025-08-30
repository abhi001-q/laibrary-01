import Book from '../models/Book.js';
import BorrowRecord from '../models/BorrowRecord.js';

// Get librarian dashboard stats
export const getLibrarianDashboard = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments({ uploadedBy: req.user._id });
    const totalBorrowed = await BorrowRecord.countDocuments({
      book: { $in: await Book.find({ uploadedBy: req.user._id }).distinct('_id') },
      returnedDate: null
    });
    
    res.json({
      totalBooks,
      totalBorrowed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get books uploaded by the librarian
export const getMyBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const books = await Book.find({ uploadedBy: req.user._id })
      .populate('category', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Book.countDocuments({ uploadedBy: req.user._id });
    
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