import express from 'express';
import {
  getReadingHistory,
  borrowBook,
  returnBook
} from '../controllers/borrowerController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import ROLES from '../config/roles.js';

const router = express.Router();

// All routes protected for borrowers only
router.use(authMiddleware, roleMiddleware([ROLES.BORROWER]));

router.get('/reading-history', getReadingHistory);
router.post('/borrow/:bookId', borrowBook);
router.put('/return/:recordId', returnBook);

  

export default router;