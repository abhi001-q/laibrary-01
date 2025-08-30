import React from 'react';
import { useAuth } from './context/AuthContext';
import { useLocation } from 'react-router-dom';

const Debug = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Current Route</h2>
        <p><strong>Path:</strong> {location.pathname}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        <p><strong>User:</strong> {currentUser ? 'Logged in' : 'Not logged in'}</p>
        {currentUser && (
          <div className="mt-2">
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Role:</strong> {currentUser.role}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Approved:</strong> {currentUser.isApproved ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Environment</h2>
        <p><strong>API URL:</strong> {import.meta.env.VITE_API_BASE_URL}</p>
      </div>
    </div>
  );
};

export default Debug;
