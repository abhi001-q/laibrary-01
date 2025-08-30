import { api } from './api';

export const adminService = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Users
  getUsers: () => api.get('/admin/users'),
  toggleUserBan: (userId) => api.put(`/admin/users/${userId}/toggle-ban`),
  toggleLibrarianApproval: (userId) => api.put(`/admin/users/${userId}/toggle-approval`),
  
  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (categoryData) => api.post('/admin/categories', categoryData),
  deleteCategory: (categoryId) => api.delete(`/admin/categories/${categoryId}`),
  
  // Books (admin can manage all books)
  getAllBooks: (params) => api.get('/books', { params }),
  deleteBook: (bookId) => api.delete(`/books/${bookId}`),
  updateBook: (bookId, data) => api.put(`/books/${bookId}`, data),
};