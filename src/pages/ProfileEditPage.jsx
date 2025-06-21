import React, { useState, useEffect } from 'react';

export default function ProfileEditPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // You would typically fetch existing profile data here
  // For now, let's assume we have some placeholder data or states for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('https://via.placeholder.com/150'); // Default placeholder image

  // UPDATED APPS SCRIPT WEB APP URL AND API KEY
  // If this page needs to interact with Apps Script, include these
  const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyKSqMthS7IR66S_XBlw_FQIwWW758DydvRaPnDAI7aeP42OFFR-WfwPN-CmADlOr65Rg/exec'; // Your deployed URL
  const API_KEY = 'Chanuga@2025'; // Your new API Key

  useEffect(() => {
    // In a real application, you'd fetch the current user's profile data here
    // For example, if you're using Firebase Auth, you might get user.displayName, user.email, user.photoURL
    // For now, setting some dummy data to simulate loading
    setTimeout(() => { // Simulate API call delay
        setName('Admin User');
        setEmail('aquaticresearch.fmst@gmail.com'); // This matches your Admin Profile screenshot
        // If user.photoURL is available from Firebase, setProfilePicUrl(user.photoURL);
        setLoading(false); 
    }, 500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Example of how you might send data to Apps Script (if needed for profile update)
    try {
      const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: API_KEY,
          action: 'updateProfile', // A new action for Apps Script to handle
          name: name,
          email: email,
          // ... other data to send for profile update
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile via Apps Script.");
      }

      const data = await response.json();
      if (data.success) {
        setMessage("Profile updated successfully!");
        // Maybe refresh data or navigate
      } else {
        throw new Error(data.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl text-gray-700 dark:text-gray-300">
        Loading Profile Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Edit Profile</h2>

        {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
        {message && <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</p>}

        <div className="flex flex-col items-center mb-6">
          <img 
            src={profilePicUrl} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-400 dark:border-blue-600" 
          />
          <p className="text-gray-600 dark:text-gray-400 text-sm">(ඔබගේ Google ගිණුමේ පැතිකඩ පින්තූරය භාවිතා කරයි)</p> {/* This line is from your screenshot */}
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">නාමය</label> {/* "නාමය" from your screenshot */}
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ඊ-මේල්</label> {/* "ඊ-මේල්" translated from your screenshot */}
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Add more fields as needed for profile editing */}
          {/* Example: "කතතුර" (designation) and "විස්තරය" (description) from your screenshot */}
          {/*
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">කතතුර</label>
            <input
              type="text"
              id="designation"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={designation} // You'd need to define a state for designation
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">විස්තරය</label>
            <textarea
              id="description"
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={description} // You'd need to define a state for description
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          */}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'ප්‍රගතිය...' : 'වෙනස්කම් සුරකින්න'} {/* "වෙනස්කම් සුරකින්න" from your screenshot */}
          </button>
          <button
            type="button" // Use type="button" to prevent form submission
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            onClick={() => {/* Handle cancel or navigate back */}}
          >
            අවලංගු කරන්න {/* "අවලංගු කරන්න" from your screenshot */}
          </button>
        </form>
      </div>
    </div>
  );
}