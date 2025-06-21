// src/Dashboard.jsx-06/20/2025
import React, { useEffect, useState } from 'react';
import { db, ref, onValue } from './firebase-user'; // use user DB only for loginLogs
import { auth } from './firebase'; // admin project's auth only
import { signOut } from 'firebase/auth';
import Papa from 'papaparse';
import AdminProfile from './components/AdminProfile';

export default function Dashboard({ user }) { // App.js වෙතින් user prop එක ලබා ගන්න
const [logs, setLogs] = useState([]);
const [filtered, setFiltered] = useState([]);
const [productFilter, setProductFilter] = useState('All');

// localStorage වෙතින් තේමාව ආරම්භ කරන්න, නොමැති නම් 'light'
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

// Firebase Logs ලබා ගැනීම
useEffect(() => {
const logsRef = ref(db, "loginLogs");
const unsubscribe = onValue(logsRef, (snapshot) => {
const data = snapshot.val();
const logList = [];
for (let key in data) {
logList.push({ id: key, ...data[key] });
}
// මෙහි වෙනස්කම! b.time - a.time ලෙස නිවැරදි කර ඇත.
const sorted = logList.sort((a, b) => new Date(b.time) - new Date(a.time));
setLogs(sorted);
setFiltered(sorted);
});
return () => unsubscribe(); // Firebase listener සඳහා Cleanup function
}, []);

// Product Filter කිරීම
useEffect(() => {
if (productFilter === 'All') setFiltered(logs);
else setFiltered(logs.filter(log => log.product === productFilter));
}, [productFilter, logs]);

// Theme වෙනස් වූ විට HTML element එකට 'dark' class එක යෙදීම සහ localStorage හි ගබඩා කිරීම
useEffect(() => {
if (theme === 'dark') {
document.documentElement.classList.add('dark');
localStorage.setItem('theme', 'dark');
} else {
document.documentElement.classList.remove('dark');
localStorage.setItem('theme', 'light');
}
}, [theme]);

// CSV Export කිරීම
const exportCSV = () => {
const csv = Papa.unparse(filtered);
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.setAttribute("href", url);
link.setAttribute("download", "login-records.csv");
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
};

// Logout ශ්‍රිතය
const handleLogout = () => {
signOut(auth);
// Logout වූ පසු, user state එක null වනු ඇත, එවිට App.js Login component එක render කරයි.
};

return (
// Tailwind CSS classes භාවිතයෙන් Dark Mode සඳහා support
<div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
{/* Sidebar - පසුබිම අළු පැහැයට වෙනස් කර ඇත (bg-gray-200 / dark:bg-gray-700) */}
<div className="w-64 bg-gray-200 dark:bg-gray-700 shadow-lg flex flex-col justify-between p-4">
<div>
{/* user prop එක AdminProfile වෙත යවමු */}
<AdminProfile user={user} />
</div>
<div className="mt-4 space-y-2">
{/* ඔබට අවශ්‍ය එකම Logout බොත්තම මෙයයි */}
<button
onClick={handleLogout}
className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
>
🔓 Logout
</button>
{/* Dark Mode/Light Mode බොත්තම */}
<button
onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
>
{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
</button>
</div>
</div>

{/* Main content area */}
<div className="flex-1 p-6">
<h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">🔐 Login Records</h2>

{/* Filter & Export */}
<div className="mb-4">
<label className="font-semibold text-gray-700 dark:text-gray-300">Filter by Product:</label>
<select
onChange={(e) => setProductFilter(e.target.value)}
className="ml-2 px-3 py-1 rounded border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
>
<option value="All">All</option>
{[...Array(15)].map((_, i) => (
<option key={i + 1} value={`Product ${i + 1}`}>{`Product ${i + 1}`}</option>
))}
</select>
<button
onClick={exportCSV}
className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
>
📤 Export CSV
</button>
</div>

{/* Table */}
<div className="overflow-auto shadow-md rounded-md">
<table className="min-w-full bg-white dark:bg-gray-800 rounded-md overflow-hidden">
<thead>
<tr className="bg-blue-900 text-white">
<th className="py-2 px-4 text-left">Product</th>
<th className="py-2 px-4 text-left">Name</th>
<th className="py-2 px-4 text-left">Email</th>
<th className="py-2 px-4 text-left">Time</th>
</tr>
</thead>
<tbody>
{filtered.map((log) => (
<tr key={log.id} className="border-b border-gray-200 dark:border-gray-700 odd:bg-gray-50 dark:odd:bg-gray-700">
<td className="py-2 px-4 text-gray-800 dark:text-gray-200">{log.product}</td>
<td className="py-2 px-4 text-gray-800 dark:text-gray-200">{log.name}</td>
<td className="py-2 px-4 text-gray-800 dark:text-gray-200">{log.email}</td>
<td className="py-2 px-4 text-gray-800 dark:text-gray-200">{new Date(log.time).toLocaleString()}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</div>
);
}
