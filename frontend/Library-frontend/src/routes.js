import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layout Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// Welcome Page
import Welcome from "./Pages/Welcome";

// Auth Pages
import Login from "./Pages/auth/login";
import Register from "./Pages/auth/Register";

// Borrower Pages
import BorrowerHome from "./Pages/borrower/Home";
import BookDetail from "./Pages/borrower/BookDetail";
import MyLibrary from "./Pages/borrower/MyLibrary";

// Admin Pages
import AdminDashboard from "./Pages/Admin/Dashboard";
import ManageBooks from "./Pages/Admin/ManageBooks";
import ManageUsers from "./Pages/Admin/ManageUsers";
import LibrarianApprovals from "./Pages/Admin/LibrarianApprovals";
import Categories from "./Pages/Admin/Categories";

// Librarian Pages
import LibrarianDashboard from "./Pages/Librarinas/LibrarinaDashboard";
import MyBooks from "./Pages/Librarinas/Mybooks";
import UploadBook from "./Pages/Librarinas/UploadedBook";
import AccountSettings from "./Pages/Librarinas/AccountSetting";

// Debug component
import Debug from "./Debug";
import PDFReader from "./Pages/borrower/PDFReader";   // ✅ sahi path check kar lena


// Profile component
import Profile from "./components/Profile";


const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Librarians are auto-approved, so no need to check approval status

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          !currentUser ? <Login /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route
        path="/register"
        element={
          !currentUser ? <Register /> : <Navigate to="/dashboard" replace />
        }
      />

      {/* Welcome/Landing Route */}
      <Route
        path="/"
        element={
          !currentUser ? <Welcome /> : <Navigate to="/dashboard" replace />
        }
      />

      {/* Dashboard Routes - Main entry point after login */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {currentUser?.role === "borrower" && <BorrowerHome />}
            {currentUser?.role === "admin" && <AdminDashboard />}
            {currentUser?.role === "librarian" && <LibrarianDashboard />}
          </ProtectedRoute>
        }
      />

      {/* Borrower Routes */}
      <Route
        path="/book/:id"
        element={
          <ProtectedRoute requiredRole="borrower">
            <BookDetail />
          </ProtectedRoute>
        }
      />
      {/* Removed PDFReader route - borrowers open PDFs directly */}
      <Route
        path="/my-library"
        element={
          <ProtectedRoute requiredRole="borrower">
            <MyLibrary />
          </ProtectedRoute>
        }
      />
      <Route path="/read/:id" element={<PDFReader />} />


      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/books"
        element={
          <ProtectedRoute requiredRole="admin">
            <ManageBooks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/approvals"
        element={
          <ProtectedRoute requiredRole="admin">
            <LibrarianApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute requiredRole="admin">
            <Categories />
          </ProtectedRoute>
        }
      />

      {/* Librarian Routes */}
      <Route
        path="/librarian"
        element={
          <ProtectedRoute requiredRole="librarian">
            <LibrarianDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/librarian/books"
        element={
          <ProtectedRoute requiredRole="librarian">
            <MyBooks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/librarian/upload"
        element={
          <ProtectedRoute requiredRole="librarian">
            <UploadBook />
          </ProtectedRoute>
        }
      />
      <Route
        path="/librarian/settings"
        element={
          <ProtectedRoute requiredRole="librarian">
            <AccountSettings />
          </ProtectedRoute>
        }
      />

      {/* Profile route - accessible to all authenticated users */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Debug route */}
      <Route path="/debug" element={<Debug />} />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
