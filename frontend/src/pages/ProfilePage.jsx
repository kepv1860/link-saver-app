import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
// import { useAuth } from '../contexts/AuthContext'; // For a more robust auth state management

const ProfilePage = () => {
  // const { currentUser, token, logout } = useAuth(); // Example if using AuthContext
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editProfileImageUrl, setEditProfileImageUrl] = useState('');
  const [editPassword, setEditPassword] = useState(''); // For changing password

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Retrieve stored user info and token (replace with context or state management)
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedUser.id && storedToken) {
          // In a real app, you might want to verify the token or refresh user data
          const profileData = await apiService.getProfile(storedUser.id, storedToken);
          setUser(profileData);
          setEditUsername(profileData.username);
          setEditEmail(profileData.email);
          setEditPhoneNumber(profileData.phone_number || '');
          setEditProfileImageUrl(profileData.profile_image_url || '');
        } else {
          setError('User not logged in or session expired.');
          // Redirect to login or handle appropriately
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing && user) {
        // Reset edit fields to current user data if canceling edit
        setEditUsername(user.username);
        setEditEmail(user.email);
        setEditPhoneNumber(user.phone_number || '');
        setEditProfileImageUrl(user.profile_image_url || '');
        setEditPassword('');
    }
    setIsEditing(!isEditing);
    setError(''); // Clear previous errors
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    const storedToken = localStorage.getItem('authToken');

    if (!storedUser || !storedToken) {
        setError('Authentication required.');
        setIsLoading(false);
        return;
    }

    const updatedData = {
        username: editUsername,
        email: editEmail,
        phone_number: editPhoneNumber,
        profile_image_url: editProfileImageUrl,
    };
    if (editPassword) {
        updatedData.password = editPassword;
    }

    try {
        const response = await apiService.updateProfile(storedUser.id, updatedData, storedToken);
        setUser(response.user); // Update local user state
        localStorage.setItem('currentUser', JSON.stringify(response.user)); // Update stored user
        setIsEditing(false);
        setEditPassword(''); // Clear password field
        alert('Profile updated successfully!');
    } catch (err) {
        setError(err.message || 'Failed to update profile.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    // if (logout) logout(); // If using AuthContext
    // Redirect to login page
    alert('Logged out successfully!');
    window.location.href = '/login'; // Or use React Router for navigation
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  if (error && !user) {
    return <div className="p-4 text-center text-red-500">Error: {error} <a href="/login" class="text-blue-500 hover:underline">Login here</a></div>;
  }

  if (!user) {
    // This case should ideally be handled by routing or the AuthContext
    return <div className="p-4 text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Profile</h1>
            <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
            >
                Logout
            </button>
        </div>

        {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              {user.profile_image_url ? (
                <img src={user.profile_image_url} alt="Profile" className="mt-1 w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="mt-1 w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">No Image</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="mt-1 text-lg text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <p className="mt-1 text-lg text-gray-900">{user.phone_number || 'Not provided'}</p>
            </div>
            <button
              onClick={handleEditToggle}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="profileImageUrl">
                Profile Image URL
              </label>
              <input
                className="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="profileImageUrl"
                type="text"
                placeholder="http://example.com/image.png"
                value={editProfileImageUrl}
                onChange={(e) => setEditProfileImageUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                Username
              </label>
              <input
                className="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                className="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                className="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phoneNumber"
                type="tel"
                placeholder="Your phone number"
                value={editPhoneNumber}
                onChange={(e) => setEditPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                New Password (leave blank to keep current)
              </label>
              <input
                className="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="New Password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className={`w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleEditToggle}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

