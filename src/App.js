// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe(); // cleanup
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => setUser(null));
  };

  return (
    <div>
      {user ? (
        <>
          <button
            onClick={handleLogout}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: '#c00',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
          <Dashboard />
        </>
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
