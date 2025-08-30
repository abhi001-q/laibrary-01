import { createContext, useContext, useState, useEffect } from "react";
import { FaBookOpen } from "react-icons/fa";
import { authAPI } from "../Services/api";

const AuthContext = createContext();
export { AuthContext };

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authAPI
        .getProfile()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((error) => {
          console.error("Auth profile fetch failed:", error);
          localStorage.removeItem("token");
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem("token", response.token);
    setCurrentUser(response);
    return response;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    localStorage.setItem("token", response.token);
    setCurrentUser(response);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUser,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaBookOpen className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading Library System...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
