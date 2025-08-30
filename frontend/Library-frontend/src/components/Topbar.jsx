import { useAuth } from "../context/AuthContext";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";
import NotificationCenter from "./NotificationCenter";

const Topbar = () => {
  const { currentUser } = useAuth();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    
    // If it's already a full URL, use it as-is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, make it absolute
    const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    return `${baseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  return (
    <div className="bg-white border-b h-[80px] border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search books..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="flex items-center space-x-4">
          <NotificationCenter />

          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
              {currentUser?.profilePhoto ? (
                <img
                  src={getImageUrl(currentUser.profilePhoto)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.target.style.display = 'none';
                    const initials = document.createElement('span');
                    initials.className = 'text-sm font-medium text-primary-600';
                    initials.textContent = currentUser?.name?.charAt(0).toUpperCase() || '?';
                    e.target.parentElement.appendChild(initials);
                  }}
                />
              ) : (
                <span className="text-sm font-medium text-primary-600">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </span>
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
        </div>
      </div>
    </div>
  );
};

export default Topbar;
