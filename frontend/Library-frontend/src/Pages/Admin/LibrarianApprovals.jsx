import React, { useState, useEffect } from "react";
import { adminService } from "../../Services/adminServices";
import { FaCheckCircle, FaTimesCircle, FaClock, FaUser } from "react-icons/fa";

const LibrarianApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getUsers();
      const usersData = response.data || response;

      // Filter for pending librarian approvals
      const pending = usersData.filter(
        (user) => user.role === "librarian" && !user.isApproved
      );
      setPendingApprovals(pending);
    } catch (err) {
      console.error("Failed to fetch pending approvals:", err);
      setError("Failed to load pending approvals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId, approve) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));

      await adminService.toggleLibrarianApproval(userId);

      // Remove the user from pending approvals list
      setPendingApprovals((prev) => prev.filter((user) => user._id !== userId));

      // Show success message
      const action = approve ? "approved" : "rejected";
      alert(`Librarian has been ${action} successfully!`);
    } catch (err) {
      console.error("Failed to process approval:", err);
      alert("Failed to process approval. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
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
          onClick={fetchPendingApprovals}
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
        <h1 className="text-2xl font-bold text-gray-900">
          Librarian Approvals
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and approve librarian account requests
        </p>
      </div>

      {pendingApprovals && pendingApprovals.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
                     <FaCheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-500">
            No pending librarian approvals at the moment.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {pendingApprovals &&
                pendingApprovals.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                     <FaUser className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center mt-1">
                                                     <FaClock className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-400">
                            Registered:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleApproval(user._id, false)}
                        disabled={actionLoading[user._id]}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                                                 <FaTimesCircle className="w-4 h-4 mr-1" />
                        {actionLoading[user._id] ? "Processing..." : "Reject"}
                      </button>

                      <button
                        onClick={() => handleApproval(user._id, true)}
                        disabled={actionLoading[user._id]}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                                                 <FaCheckCircle className="w-4 h-4 mr-1" />
                        {actionLoading[user._id] ? "Processing..." : "Approve"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianApprovals;
