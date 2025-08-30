import React, { useState, useEffect } from "react";
import { adminService } from "../../Services/adminServices";
import { FaUser, FaShieldAlt } from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getUsers();
      const usersData = response.data || response;
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId, currentBanStatus) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));

      await adminService.toggleUserBan(userId);

      // Update the user in the list
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isBanned: !currentBanStatus } : user
        )
      );

      const action = currentBanStatus ? "unbanned" : "banned";
      alert(`User has been ${action} successfully!`);
    } catch (err) {
      console.error("Failed to toggle user ban:", err);
      alert("Failed to update user status. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "librarian":
        return "bg-blue-100 text-blue-800";
      case "borrower":
      default:
        return "bg-gray-100 text-gray-800";
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
          onClick={fetchUsers}
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage all users in the system
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className={user.isBanned ? "bg-red-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                     <FaUser className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                    {user.role === "librarian" && !user.isApproved && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending Approval
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isBanned
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleToggleBan(user._id, user.isBanned)}
                        disabled={actionLoading[user._id]}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded ${
                          user.isBanned
                            ? "text-green-700 bg-green-100 hover:bg-green-200"
                            : "text-red-700 bg-red-100 hover:bg-red-200"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
                      >
                        {user.isBanned ? (
                          <>
                                                         <FaShieldAlt className="w-3 h-3 mr-1" />
                            {actionLoading[user._id] ? "Unban..." : "Unban"}
                          </>
                        ) : (
                          <>
                                                         <FaShieldAlt className="w-3 h-3 mr-1" />
                            {actionLoading[user._id] ? "Ban..." : "Ban"}
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users && users.length === 0 && (
          <div className="text-center py-12">
                         <FaUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No users are registered in the system yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
