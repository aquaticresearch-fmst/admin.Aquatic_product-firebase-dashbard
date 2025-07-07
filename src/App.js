// src/App.js
import React, { useState, useEffect } from 'react';
// ⛔️ එකතු කරන ලදි: React Router DOM වෙතින් අවශ්‍ය components
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// ⛔️ එකතු කරන ලදි: අලුත් Pages සඳහා Imports
import AllRequestsPage from './AllRequestsPage';
import RequestDetailsPage from './RequestDetailsPage';

function App() {
  const [user, setUser] = useState(null);
  // ⛔️ එකතු කරන ලදි: Authentication load වන තෙක් තත්ත්වය පාලනය කිරීමට
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // ⛔️ වෙනස් කරන ලදි: Authentication තත්ත්වය පරීක්ෂා කිරීම අවසන් වූ පසු loading නවත්වන්න
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup function
  }, []);

  // ⛔️ එකතු කරන ලදි: Loading තත්ත්වය පෙන්වීමට
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        Loading authentication...
      </div>
    );
  }

  return (
    // ⛔️ වෙනස් කරන ලදි: Router සහ Routes භාවිතයෙන් Pages navigate කිරීමට
    <Router>
      <Routes>
        {/* Login Page */}
        {/* ⛔️ වෙනස් කරන ලදි: පරිශීලකයා ලොග් වී ඇත්නම් Dashboard වෙත යොමු කරන්න, නැතිනම් Login පෙන්වන්න */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={setUser} />} />

        {/* Protected Routes - පරිශීලකයා ලොග් වී ඇත්නම් පමණක් ප්‍රවේශ විය හැක */}
        {/* ⛔️ එකතු කරන ලදි: Dashboard Route එක */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        {/* ⛔️ එකතු කරන ලදි: AllRequestsPage Route එක */}
        <Route
          path="/requests"
          element={user ? <AllRequestsPage /> : <Navigate to="/login" />}
        />
        {/* ⛔️ එකතු කරන ලදි: RequestDetailsPage Route එක (ID parameter සමඟ) */}
        <Route
          path="/request/:id"
          element={user ? <RequestDetailsPage /> : <Navigate to="/login" />}
        />

        {/* Default Route - මුල් පිටුවට (/) පිවිසෙන විට dashboard වෙත යොමු කරන්න, ලොග් වී නොමැති නම් login වෙත */}
        {/* ⛔️ එකතු කරන ලදි: Default Route */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* ⛔️ එකතු කරන ලදි: අනිත් routes සඳහා 404 page එකක් */}
        <Route path="*" element={<h1 className="text-center text-3xl mt-20 text-gray-800 dark:text-gray-200">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;