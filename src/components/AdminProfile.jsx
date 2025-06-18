import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

export default function AdminProfile() {
  const auth = getAuth();
  const user = auth.currentUser;

  const name = user?.displayName || 'N/A';
  const email = user?.email || 'N/A';
  const photoURL = user?.photoURL || 'https://www.gravatar.com/avatar/?d=mp';

  const isAdmin = email === "lishani@fmst.ac.lk";

  const handleLogout = () => {
    signOut(auth).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto mt-8 font-sans dark:bg-gray-800 dark:text-white">
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
      <div className="mb-2">
        <span className="font-semibold">Email:</span> {email}
      </div>
      <div className="text-sm text-gray-500 mt-4 dark:text-gray-400">
        Logged in: {new Date().toLocaleString()}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow"
      >
        🔓 Logout
      </button>
    </div>
  );
}
