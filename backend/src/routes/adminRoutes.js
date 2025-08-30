import express from 'express';
import {
  getDashboardStats,
  getUsers,
  toggleUserBan,
  toggleLibrarianApproval,
  getCategories,
  createCategory,
  deleteCategory
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import ROLES from '../config/roles.js';

const router = express.Router();

// All routes protected for admins only
router.use(authMiddleware, roleMiddleware([ROLES.ADMIN]));

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle-ban', toggleUserBan);
router.put('/users/:id/toggle-approval', toggleLibrarianApproval);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

export default router;