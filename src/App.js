// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Routing සඳහා
import Login from './Login';
import Dashboard from './Dashboard';
import ProfileDetails from './components/ProfileDetails'; // නව component එක
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state එකක් එකතු කරමු

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Auth state එක තහවුරු වූ පසු loading අවසන් කරන්න
    });
    return () => unsubscribe(); // cleanup function
  }, []);

  if (loading) {
    // Auth state එක පරීක්ෂා කරන අතරතුර Loading පෙන්වන්න
    return <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl text-gray-700 dark:text-gray-300">Loading...</div>;
  }

  return (
    <Router> {/* මුළු App එකම Router එකකින් wrap කරන්න */}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={setUser} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        {/* නව Profile Details පිටුව සඳහා Route එක */}
        <Route
          path="/profile-details"
          element={user ? <ProfileDetails user={user} /> : <Navigate to="/login" />}
        />
        {/* Default route for any unmatched paths */}
        <Route path="*" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;