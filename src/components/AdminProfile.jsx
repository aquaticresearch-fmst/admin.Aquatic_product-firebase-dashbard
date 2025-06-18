// src/components/AdminProfile.jsx
import React from 'react';
// Firebase auth මෙහිදී අවශ්‍ය නැත, මන්ද logout බොත්තම ඉවත් කර ඇත.
// import { getAuth, signOut } from 'firebase/auth'; 

export default function AdminProfile({ user }) { // Dashboard වෙතින් user prop එක ලබා ගන්න
  // const auth = getAuth(); // මෙහිදී auth direct අවශ්‍ය නැත
  // const user = auth.currentUser; // user prop එක ලෙස ලැබෙන නිසා මෙහිදී direct Firebase Auth අවශ්‍ය නැත.

  // user prop එකෙන් දත්ත ලබා ගන්න
  const name = user?.displayName || 'N/A';
  const email = user?.email || 'N/A';
  const photoURL = user?.photoURL || 'https://www.gravatar.com/avatar/?d=mp';

  const isAdmin = email === "lishani@fmst.ac.lk";

  // Logout බොත්තම ඉවත් කළ නිසා handleLogout ශ්‍රිතය ද ඉවත් කර ඇත.
  // const handleLogout = () => {
  //   signOut(auth).then(() => {
  //     window.location.reload();
  //   });
  // };

  return (
    // AdminProfile හි පසුබිම වෙනස් කිරීම අවශ්‍ය නැත, මන්ද Sidebar එකේ පසුබිම වෙනස් කරමු.
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto font-sans dark:bg-gray-800 dark:text-white">
      <div className="flex items-center mb-4">
        <img
          src={photoURL}
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
        <span className="font-semibold">Name:</span> {name}
      </div>
      <div className="mb-2 text-xs"> {/* text-xs class එක එකතු කර ඇත. */}
        <span className="font-semibold">Email:</span> {email}
      </div>
      <div className="text-sm text-gray-500 mt-4 dark:text-gray-400">
        Logged in: {new Date().toLocaleString()}
      </div>

      {/* Logout බොත්තම මෙතනින් ඉවත් කර ඇත. */}
      {/*
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow"
      >
        🔓 Logout
      </button>
      */}
    </div>
  );
}