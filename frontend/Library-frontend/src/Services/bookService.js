import { api } from './api';

export const bookService = {
  // Public book operations
  getBooks: (params) => api.get('/books', { params }),
  getBook: (bookId) => api.get(`/books/${bookId}`),
  
  // Borrower operations
  getReadingHistory: (params) => api.get('/borrower/reading-history', { params }),
  borrowBook: (bookId) => api.post(`/borrower/borrow/${bookId}`),
  returnBook: (recordId) => api.put(`/borrower/return/${recordId}`),
  
  // Search
  searchBooks: (query) => api.get('/books', { params: { search: query } }),
  getBooksByCategory: (category) => api.get('/books', { params: { category } }),

};

export default bookService;
