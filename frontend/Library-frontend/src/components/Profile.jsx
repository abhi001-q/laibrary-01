import React, { useState, useEffect } from "react";
import { FaUser, FaCamera, FaSave, FaTimes } from "react-icons/fa";
import { authAPI } from "../Services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    profilePhoto: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (currentUser) {
      console.log('=== CURRENT USER PROFILE DEBUG ===');
      console.log('Full currentUser:', currentUser);
      console.log('currentUser.profilePhoto:', currentUser.profilePhoto);
      console.log('currentUser.isApproved:', currentUser.isApproved);
      console.log('Constructed profile photo URL:', getImageUrl(currentUser.profilePhoto));
      
      setProfile({
        name: currentUser.name || "",
        email: currentUser.email || "",
        role: currentUser.role || "",
        profilePhoto: currentUser.profilePhoto || "",
        isApproved: currentUser.isApproved
      });
      setPhotoPreview(currentUser.profilePhoto || "");
      
      // Also load fresh profile data from API
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      console.log('=== PROFILE API RESPONSE DEBUG ===');
      console.log('Full profile data:', data);
      console.log('Profile photo field:', data.profilePhoto);
      console.log('Constructed profile photo URL:', getImageUrl(data.profilePhoto));
      setProfile(data);
      setPhotoPreview(data.profilePhoto || "");
    } catch (error) {
      console.error("Error loading profile:", error);
      setMessage("Failed to load profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage("");

    try {
      const updatedProfile = await authAPI.updateProfile({
        name: profile.name,
        email: profile.email,
      });

      // Update the user context
      if (updateUser) {
        updateUser({ ...currentUser, ...updatedProfile });
      }
      
      setProfile(updatedProfile);
      setIsEditing(false);
      setMessage("Profile updated successfully!");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhoto) return;

    setLoading(true);
    setMessage("");

    try {
      const updatedProfile = await authAPI.updateProfilePhoto(selectedPhoto);
      
      // Update the profile state with the new photo URL
      const newProfile = { ...profile, profilePhoto: updatedProfile.profilePhoto };
      setProfile(newProfile);
      
      // Update the photo preview with the new URL
      setPhotoPreview(updatedProfile.profilePhoto);
      
      // Update the user context
      if (updateUser) {
        updateUser({ ...currentUser, profilePhoto: updatedProfile.profilePhoto });
      }
      
      setSelectedPhoto(null);
      setMessage("Profile photo updated successfully!");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update profile photo"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadProfile(); // Reset to original values
    setSelectedPhoto(null);
    setPhotoPreview(profile.profilePhoto || "");
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(profile.profilePhoto || "");
  };

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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center"
            >
              <FaUser className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Photo Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-300">
              {photoPreview ? (
                <img
                  src={getImageUrl(photoPreview)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center';
                    fallback.innerHTML = '<svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>';
                    e.target.parentElement.appendChild(fallback);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUser className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                <FaCamera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {isEditing && selectedPhoto && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePhotoUpload}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                <FaSave className="w-4 h-4 mr-2" />
                {loading ? "Uploading..." : "Upload Photo"}
              </button>
              <button
                onClick={handleRemovePhoto}
                className="btn-secondary flex items-center"
              >
                <FaTimes className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              value={profile.role}
              disabled
              className="input-field bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile.isApproved
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {profile.isApproved ? "Approved" : "Pending Approval"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button onClick={handleCancelEdit} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="btn-primary flex items-center"
            >
              <FaSave className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div
            className={`p-3 rounded-md ${
              message.includes("successfully")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
