import BorrowRecord from "../models/BorrowRecord.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

// Get borrower's reading history
export const getReadingHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const records = await BorrowRecord.find({ user: req.user._id })
      .populate("book", "title author coverImageUrl")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ borrowedDate: -1 });

    const total = await BorrowRecord.countDocuments({ user: req.user._id });

    res.json({    
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Borrow a book
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ message: "Book is not available" });
    }

    const existingRecord = await BorrowRecord.findOne({
      user: req.user._id,
      book: bookId,
      returnedDate: null,
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "You have already borrowed this book" });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrowRecord = await BorrowRecord.create({
      user: req.user._id,
      book: bookId,
      dueDate,
    });

    book.isAvailable = false;
    await book.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { borrowedBooks: bookId },
    });

    res.status(201).json(borrowRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Return a book
export const returnBook = async (req, res) => {
  try {
    const { recordId } = req.params;

    const borrowRecord = await BorrowRecord.findById(recordId).populate("book");

    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    if (borrowRecord.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to return this book" });
    }

    if (borrowRecord.returnedDate) {
      return res.status(400).json({ message: "Book already returned" });
    }

    borrowRecord.returnedDate = new Date();
    await borrowRecord.save();

    await Book.findByIdAndUpdate(borrowRecord.book._id, {
      isAvailable: true,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { borrowedBooks: borrowRecord.book._id },
    });

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


