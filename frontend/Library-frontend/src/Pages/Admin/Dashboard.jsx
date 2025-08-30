import { useState, useEffect } from "react";
import { adminService } from "../../Services/adminServices";
import StatsCard from "../../components/StatsCard";
import { FaBookOpen } from "react-icons/fa";
import { SiBookstack } from "react-icons/si";
import { FaUsers } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { CgMenuGridR } from "react-icons/cg";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalBorrowed: 0,
    totalCategories: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setError("");
      const response = await adminService.getDashboardStats();
      const statsData = response.data || response;
      setStats({
        totalBooks: statsData.totalBooks || 0,
        totalUsers: statsData.totalUsers || 0,
        totalBorrowed: statsData.totalBorrowed || 0,
        totalCategories: statsData.totalCategories || 0,
        pendingApprovals: statsData.pendingApprovals || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
      setError("Failed to load dashboard statistics. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-600">{error}</div>
        <button
          onClick={loadDashboardStats}
          className="mt-2 text-red-600 hover:text-red-500 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of the library system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatsCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<SiBookstack className="w-10 h-10 text-indigo-600" />}
          color=""
        />

        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers className="w-10 h-10 text-green-600" />}
          color=""
        />
        <StatsCard
          title="Borrowed Books"
          value={stats.totalBorrowed}
          icon={<FaBookOpen className="w-10 h-10 text-purple-600" />}
          color=""
        />
        <StatsCard
          title="Categories"
          value={stats.totalCategories}
          icon={<CgMenuGridR className="w-10 h-10 text-red-600" />}
          color=""
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<MdPendingActions className="w-10 h-10 text-orange-600" />}
          color=""
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">+5</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    New books added
                  </p>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">+3</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    New users registered
                  </p>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">
                    +8
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Books borrowed
                  </p>
                  <p className="text-sm text-gray-500">This week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Database
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                File Storage
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                API Services
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                User Authentication
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
