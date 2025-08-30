import express from 'express';
import {
  getLibrarianDashboard,
  getMyBooks
} from '../controllers/librarianController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import ROLES from '../config/roles.js';

const router = express.Router();

// All routes protected for librarians only
router.use(authMiddleware, roleMiddleware([ROLES.LIBRARIAN]));

router.get('/dashboard', getLibrarianDashboard);
router.get('/my-books', getMyBooks);

export default router;