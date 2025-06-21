// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
const [user, setUser] = useState(null);

useEffect(() => {
const auth = getAuth();
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
setUser(currentUser);
});
return () => unsubscribe(); // cleanup function
}, []);

return (
<div>
{user ? (
// App.js හි තිබූ Logout බොත්තම ඉවත් කර ඇත.
// Dashboard component එකට user object එක prop එකක් ලෙස යවනු ලැබේ.
<Dashboard user={user} />
) : (
<Login onLogin={setUser} />
)}
</div>
);
}

export default App;