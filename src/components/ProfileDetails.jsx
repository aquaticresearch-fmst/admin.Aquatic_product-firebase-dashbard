// src/components/ProfileDetails.jsx-06/18/2025
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
// Firebase Storage related imports removed
import { useNavigate } from 'react-router-dom'; // For Navigation

export default function ProfileDetails({ user }) {
  const navigate = useNavigate();
  const db = getDatabase();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // profilePicUrl now stores the Google Photo URL
  const [profilePicUrl, setProfilePicUrl] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userProfileRef = ref(db, `adminProfiles/${user.uid}`);
    const unsubscribe = onValue(userProfileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setName(data.name || '');
        setTitle(data.title || '');
        setDescription(data.description || '');
        // Use profilePicUrl from Firebase DB if exists, otherwise user.photoURL, or default
        setProfilePicUrl(data.profilePicUrl || user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'); 
      } else {
        // If no custom data in Firebase DB, use Google's photoURL
        setName(user.displayName || '');
        setTitle('');
        setDescription('');
        setProfilePicUrl(user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'); // Use Google photo URL
      }
      setLoading(false);
    }, (err) => {
      setError("Failed to load profile: " + err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, db]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!user) {
      setError("User not logged in.");
      return;
    }

    setLoading(true);

    try {
      // Update Realtime Database
      await set(ref(db, `adminProfiles/${user.uid}`), {
        name: name,
        email: user.email, // Email is taken from Firebase Auth, no change needed
        title: title,
        description: description,
        profilePicUrl: user.photoURL || 'https://www.gravatar.com/avatar/?d=mp', // Save Google photo URL again
        lastUpdated: new Date().toISOString()
      });

      setMessage('Profile updated successfully!');
      setLoading(false);
      // Redirect from Profile Details page to Dashboard
      navigate('/dashboard'); 

    } catch (err) {
      setError("Failed to save profile: " + err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl text-gray-700 dark:text-gray-300">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Edit Profile Details</h2>

        {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
        {message && <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</p>}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <img
              src={profilePicUrl} // This displays user.photoURL or URL from Firebase DB
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-400 dark:border-blue-600"
            />
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              (Using your Google Account's profile picture)
            </p>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}