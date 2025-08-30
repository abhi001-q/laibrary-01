import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for file uploads
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  },

  updateProfilePhoto: async (photoFile) => {
    const formData = new FormData();
    formData.append("profilePhoto", photoFile);

    const response = await api.put("/auth/profile/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

// Books API endpoints
export const booksAPI = {
  getBooks: async (params = {}) => {
    const response = await api.get("/books", { params });
    return response.data;
  },

  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await api.post("/books", bookData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

// Admin API endpoints
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  toggleUserBan: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-ban`);
    return response.data;
  },

  toggleLibrarianApproval: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-approval`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/admin/categories");
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post("/admin/categories", categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

// Librarian API endpoints
export const librarianAPI = {
  getDashboard: async () => {
    const response = await api.get("/librarian/dashboard");
    return response.data;
  },

  getMyBooks: async (params = {}) => {
    const response = await api.get("/librarian/my-books", { params });
    return response.data;
  },
};

// Borrower API endpoints
export const borrowerAPI = {
  getReadingHistory: async (params = {}) => {
    const response = await api.get("/borrower/reading-history", { params });
    return response.data;
  },

  borrowBook: async (bookId) => {
    const response = await api.post(`/borrower/borrow/${bookId}`);
    return response.data;
  },

  returnBook: async (recordId) => {
    const response = await api.put(`/borrower/return/${recordId}`);
    return response.data;
  },
};

export { api };
export default api;
