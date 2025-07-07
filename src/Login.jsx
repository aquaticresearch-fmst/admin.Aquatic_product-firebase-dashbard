// src/Login.jsx
import React, { useState } from 'react';
import { auth } from './firebase'; // admin project's auth
import { signInWithEmailAndPassword } from 'firebase/auth';

// Image URLs (ඔබ ලබා දුන් ඒවා)
const BACKGROUND_IMAGE_URL = 'https://i.postimg.cc/qqp8Db4R/Faculty-of-Fisheries-and-Marine-20250614-182516-0000.jpg';
const LOGO_IMAGE_URL = 'https://i.postimg.cc/Z0t0D0rL/2025061418394446.png';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    // මුළු viewport එකම ආවරණය වන background image එක සහ මධ්‍යගත කළ අන්තර්ගතය.
    // bg-cover: background image එක div එක පුරා පිරවීමට
    // bg-center: image එක මධ්‍යගත කිරීමට
    // flex-col justify-center items-center: අන්තර්ගතය මධ්‍යගත කිරීමට
    // p-4: padding එකතු කිරීමට
    <div
      className="relative flex flex-col justify-center items-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}
    >
      {/* Login Panel */}
      {/* -mt-20 වැනි negative margin එකක් මගින් panel එක ඉහළට ඔසවනු ලැබේ */}
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full md:max-w-md -mt-20"> 
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Admin Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>
      </div>

      {/* Logo Section - තිරයේ පහළ දකුණු පැත්තේ තබමු */}
      {/* absolute: positioning සඳහා */}
      {/* bottom-4 right-4: පහළ දකුණු කෙළවරට තැබීමට (මෙහි left-4 වෙනුවට right-4 භාවිතා කර ඇත) */}
      {/* flex flex-col items-end: අන්තර්ගතය දකුණට පෙළගැස්වීමට */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end text-white text-sm">
        <div>Powered by</div>
        <img src={LOGO_IMAGE_URL} alt="JoshCS logo" className="mt-1 w-24 md:w-32 h-auto" /> {/* W-24/W-32 responsive ප්‍රමාණය */}
      </div>
    </div>
  );
}