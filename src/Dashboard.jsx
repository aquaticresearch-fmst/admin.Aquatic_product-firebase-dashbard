import React, { useEffect, useState } from 'react';
import { db, ref, onValue } from './firebase';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logsRef = ref(db, "loginLogs");
    onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      const logList = [];
      for (let key in data) {
        logList.push({ id: key, ...data[key] });
      }
      setLogs(logList.reverse());
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Login Records</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Product</th>
            <th>Name</th>
            <th>Email</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.product}</td>
              <td>{log.name}</td>
              <td>{log.email}</td>
              <td>{new Date(log.time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}