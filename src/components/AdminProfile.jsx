// src/components/AdminProfile.jsx-06/18/2025
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database'; // Firebase database imports

export default function AdminProfile({ user }) { // Get user prop from Dashboard
  const db = getDatabase();
  const [profileName, setProfileName] = useState(user?.displayName || 'N/A');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(user?.photoURL || 'https://www.gravatar.com/avatar/?d=mp');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'N/A');

  const isAdmin = profileEmail === "aquaticresearch.fmst@gmail.com"; // Change this to your Admin Email

  useEffect(() => {
    if (user) {
      const userProfileRef = ref(db, `adminProfiles/${user.uid}`);
      const unsubscribe = onValue(userProfileRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // If custom data exists, use that. Otherwise, fall back to Google's data.
          setProfileName(data.name || user.displayName || 'N/A');
          // Get profilePicUrl from Firebase DB or Google photoURL
          setProfilePhotoUrl(data.profilePicUrl || user.photoURL || 'https://www.gravatar.com/avatar/?d=mp');
          // Email is taken from Firebase Auth, no change needed.
          setProfileEmail(user.email || 'N/A');
        } else {
          // If no custom profile data, just use Google's default.
          setProfileName(user.displayName || 'N/A');
          setProfilePhotoUrl(user.photoURL || 'https://www.gravatar.com/avatar/?d=mp');
          setProfileEmail(user.email || 'N/A');
        }
      });
      return () => unsubscribe();
    }
  }, [user, db]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto font-sans dark:bg-gray-800 dark:text-white">
      <div className="flex items-center mb-4">
        <img
          src={profilePhotoUrl} // Uses Google photo URL or custom URL
          alt="Profile"
          className="w-16 h-16 rounded-full mr-4 border border-gray-300"
        />
        <div>
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200">
            👤 Admin Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {isAdmin ? 'Admin' : 'User'}
          </p>
        </div>
      </div>

      <div className="mb-2">
        <span className="font-semibold">Name:</span> {profileName}
      </div>
      <div className="mb-2 text-xs">
        <span className="font-semibold">Email:</span> {profileEmail}
      </div>
      <div className="text-sm text-gray-500 mt-4 dark:text-gray-400">
        Logged in: {new Date().toLocaleString()}
      </div>
    </div>
  );
}