// src/components/EditAdminProfile.jsx
import React, { useState, useEffect } from 'react';
// firebase-user වෙනුවට firebase වෙතින් import කරන ලදි <--- මේ line එක update කරන්න
import { db, ref, set, onValue } from '../firebase'; // <--- firebase-user වෙනුවට firebase ලෙස වෙනස් කරන්න

export default function EditAdminProfile({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Mr.');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const adminProfileRef = ref(db, 'adminProfile');
    const unsubscribe = onValue(adminProfileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setName(data.name || '');
        setTitle(data.title || 'Mr.');
        setDescription(data.description || '');
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching admin profile:", err);
      setError("Failed to load profile data.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveMessage('Saving...');
    setError(null);
    try {
      const adminProfileRef = ref(db, 'adminProfile');
      await set(adminProfileRef, {
        name,
        title,
        description,
      });
      setSaveMessage('Profile saved successfully! ✅');
      if (onSave) {
        onSave({ name, title, description });
      }
    } catch (err) {
      console.error("Error saving admin profile:", err);
      setSaveMessage('');
      setError("Failed to save profile. Please try again. ❌");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4 text-gray-800 dark:text-gray-200">Loading profile data...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600 dark:text-red-400">Error: {error}</div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-6 text-center">
        Edit Admin Profile
      </h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Admin Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <select
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          >
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="Dr.">Dr.</option>
            <option value="Prof.">Prof.</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
        {saveMessage && (
          <p className={`mt-3 text-center text-sm font-medium ${error ? 'text-red-600' : 'text-green-600'} dark:${error ? 'text-red-400' : 'text-green-400'}`}>
            {saveMessage}
          </p>
        )}
      </form>
    </div>
  );
}