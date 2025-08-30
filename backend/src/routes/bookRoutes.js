import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import upload from '../utils/fileUploader.js';
import ROLES from '../config/roles.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/:id', getBookById);

// Protected routes
router.post('/', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.LIBRARIAN]), upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), createBook);
router.put('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.LIBRARIAN]), updateBook);
router.delete('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.LIBRARIAN]), deleteBook);

export default router;