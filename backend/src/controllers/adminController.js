import User from '../models/User.js';
import Book from '../models/Book.js';
import Category from '../models/Category.js';
import BorrowRecord from '../models/BorrowRecord.js';
import ROLES from '../config/roles.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBorrowed = await BorrowRecord.countDocuments({ returnedDate: null });
    const totalCategories = await Category.countDocuments();
    
    res.json({
      totalBooks,
      totalUsers,
      totalBorrowed,
      totalCategories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ban/Unban a user
export const toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === ROLES.ADMIN) {
      return res.status(403).json({ message: 'Cannot ban an admin' });
    }
    
    user.isBanned = !user.isBanned;
    await user.save();
    
    res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject librarian
export const toggleLibrarianApproval = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== ROLES.LIBRARIAN) {
      return res.status(400).json({ message: 'User is not a librarian' });
    }
    
    user.isApproved = !user.isApproved;
    await user.save();
    
    res.json({ message: `Librarian ${user.isApproved ? 'approved' : 'rejected'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const categoryExists = await Category.findOne({ name: new RegExp('^' + name + '$', 'i') });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const booksWithCategory = await Book.findOne({ category: req.params.id });
    if (booksWithCategory) {
      return res.status(400).json({ message: 'Cannot delete category with associated books' });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};