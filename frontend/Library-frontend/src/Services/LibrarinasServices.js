import { api } from './api';

export const librarianService = {
  // Dashboard
  getDashboardStats: () => api.get('/librarian/dashboard'),
  
  // Books
  getMyBooks: (params) => api.get('/librarian/my-books', { params }),
  uploadBook: (formData, onUploadProgress) => api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onUploadProgress
  }),
  updateMyBook: (bookId, data) => api.put(`/books/${bookId}`, data),
  deleteMyBook: (bookId) => api.delete(`/books/${bookId}`),
};