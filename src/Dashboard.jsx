// src/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { db, ref, onValue } from './firebase';
import Papa from 'papaparse';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [productFilter, setProductFilter] = useState('All');

  useEffect(() => {
    const logsRef = ref(db, "loginLogs");
    onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      const logList = [];
      for (let key in data) {
        logList.push({ id: key, ...data[key] });
      }
      const sorted = logList.sort((a, b) => new Date(b.time) - new Date(a.time));
      setLogs(sorted);
      setFiltered(sorted);
    });
  }, []);

  useEffect(() => {
    if (productFilter === 'All') setFiltered(logs);
    else setFiltered(logs.filter(log => log.product === productFilter));
  }, [productFilter, logs]);

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

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI' }}>
      <h2 style={{ color: '#003366' }}>🔐 Login Records</h2>

      {/* Filter Dropdown */}
      <div style={{ marginBottom: '15px' }}>
        <label><strong>Filter by Product: </strong></label>
        <select
          onChange={(e) => setProductFilter(e.target.value)}
          style={{ padding: '6px 12px', marginLeft: '10px', borderRadius: '6px' }}
        >
          <option value="All">All</option>
          {[...Array(15)].map((_, i) => (
            <option key={i + 1} value={`Product ${i + 1}`}>{`Product ${i + 1}`}</option>
          ))}
        </select>

        {/* Export Button */}
        <button
          onClick={exportCSV}
          style={{ marginLeft: '20px', padding: '6px 16px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          📤 Export CSV
        </button>
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f9f9f9' }}>
        <thead>
          <tr style={{ background: '#003366', color: 'white' }}>
            <th style={th}>Product</th>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Time</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((log) => (
            <tr key={log.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={td}>{log.product}</td>
              <td style={td}>{log.name}</td>
              <td style={td}>{log.email}</td>
              <td style={td}>{new Date(log.time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: '10px',
  textAlign: 'left'
};

const td = {
  padding: '10px'
};
