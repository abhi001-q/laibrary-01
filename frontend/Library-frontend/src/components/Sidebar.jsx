import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaBookOpen,
  FaUser,
  FaChartBar,
  FaUsers,
  FaCheckCircle,
  FaTag,
  FaCog,
  FaUpload,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    
    // If it's a blob URL (for preview), use it as-is
    if (imagePath.startsWith('blob:')) {
      return imagePath;
    }
    
    // If it's already a full URL, use it as-is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, make it absolute
    const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    return `${baseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const borrowerLinks = [
    { path: "/dashboard", label: "Home", icon: FaHome },
    { path: "/my-library", label: "My Library", icon: FaBookOpen },
    { path: "/profile", label: "Profile", icon: FaUser },
  ];

  const adminLinks = [
    { path: "/admin", label: "Dashboard", icon: FaChartBar },
    { path: "/admin/books", label: "Manage Books", icon: FaBookOpen },
    { path: "/admin/users", label: "Manage Users", icon: FaUsers },
    {
      path: "/admin/approvals",
      label: "Librarian Approvals",
      icon: FaCheckCircle,
    },
    { path: "/admin/categories", label: "Categories", icon: FaTag },
    { path: "/profile", label: "Profile", icon: FaUser },
  ];

  const librarianLinks = [
    { path: "/librarian", label: "Dashboard", icon: FaChartBar },
    { path: "/librarian/books", label: "My Books", icon: FaBookOpen },
    { path: "/librarian/upload", label: "Upload Book", icon: FaUpload },
    { path: "/librarian/settings", label: "Settings", icon: FaCog },
    { path: "/profile", label: "Profile", icon: FaUser },
  ];

  const getLinks = () => {
    switch (currentUser?.role) {
      case "admin":
        return adminLinks;
      case "librarian":
        return librarianLinks;
      default:
        return borrowerLinks;
    }
  };

  const NavLink = ({ link }) => {
    const Icon = link.icon;
    return (
      <Link
        to={link.path}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          location.pathname === link.path
            ? "bg-primary-100 text-primary-700"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        {link.label}
      </Link>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b h-[80px] border-gray-200 flex justify-center items-center gap-2">
        <img src="src/assets/Untitled design.png" alt="SmartLib Logo" className="h-10 gap-1" />
        <h1 className="text-xl font-bold text-gray-900 ">SmartLib</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {getLinks().map((link) => (
          <NavLink key={link.path} link={link} />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
            {currentUser?.profilePhoto ? (
              <img
                src={getImageUrl(currentUser.profilePhoto)}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to user icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
                }}
              />
            ) : (
              <FaUser className="w-5 h-5 text-primary-600" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {currentUser?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {currentUser?.role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 justify-center text-md text-white hover:text-gray-700 rounded-lg bg-red-600 hover:bg-gray-100 transition-colors"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3 " />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
