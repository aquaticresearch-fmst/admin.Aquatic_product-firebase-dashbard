// src/components/AdminProfile.jsx
import React, { useState, useEffect } from 'react';
import { db, ref, onValue } from '../firebase';
import EditAdminProfile from './EditAdminProfile';

export default function AdminProfile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // මෙතනින් ඔබට අවශ්‍ය පොදු image URL එක සකසන්න
  // public folder එකේ ඇති images.jpg වෙත direct path එක.
  const commonAdminImageURL = '/images.jpg'; // <-- මේ line එක මෙලෙස වෙනස් කර ඇත

  useEffect(() => {
    const adminProfileRef = ref(db, 'adminProfile');
    const unsubscribe = onValue(adminProfileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAdminData(data);
      } else {
        setAdminData({
          name: 'Admin User',
          title: 'Mr.',
          description: 'No description available.',
        });
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching admin profile:", err);
      setError("Failed to load admin profile.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = (updatedData) => {
    setAdminData(updatedData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6 text-gray-800 dark:text-gray-200">
        Loading admin profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-6 text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mx-auto max-w-md">
        <p className="text-gray-800 dark:text-gray-200 mb-4">No admin profile data found. Click below to create one.</p>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Admin Profile
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mx-auto max-w-lg mb-8">
      {isEditing ? (
        <EditAdminProfile onSave={handleSaveProfile} onCancel={handleCancelEdit} />
      ) : (
        <>
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-4 text-center">
            Admin Profile
          </h2>
          {/* Common Profile Image Display */}
          <div className="flex justify-center mb-6">
            <img
              src={commonAdminImageURL} // පොදු image URL එක භාවිතා කරයි
              alt="Admin Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 dark:border-blue-700 shadow-md"
            />
          </div>

          <div className="space-y-3 text-gray-800 dark:text-gray-200">
            <p>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Name:</span> {adminData.title} {adminData.name}
            </p>
            <p>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Description:</span>{' '}
              {adminData.description}
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
}