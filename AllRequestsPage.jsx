// src/AllRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AllRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⛔️ මෙය ඔබගේ සැබෑ Google Apps Script Web App URL එක සමඟ ආදේශ කරන්න
  const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzKupN_mR5fLIbSwyLQbbPBPLHjud2QPo2SHr1vDFCVj32yOlME7K4cOboxGQyd4HXd/exec'; 

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${APPS_SCRIPT_WEB_APP_URL}`); // action=getAllRequests අනිවාර්ය නැහැ, doGet එකෙන් හැම Request එකක්ම return කරන නිසා
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Timestamp තීරුව මත පදනම්ව අලුත්ම Requests මුලින්ම පෙන්වීමට sort කරන්න
          const sortedRequests = data.sort((a, b) => {
            // Timestamp string එක Date object එකක් බවට හරවා සංසන්දනය කරන්න
            const dateA = new Date(a.Timestamp);
            const dateB = new Date(b.Timestamp);
            return dateB - dateA;
          });
          setRequests(sortedRequests);
        } else {
          setError('Received data is not an array.');
          setRequests([]); // දත්ත Array එකක් නොවේ නම් හිස් Array එකක් සකසන්න
        }
      } catch (err) {
        setError(`Failed to fetch requests: ${err.message}`);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [APPS_SCRIPT_WEB_APP_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        Loading requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-200 mb-6 text-center">
        📋 All Student Requests
      </h1>

      {requests.length === 0 ? (
        <div className="text-center text-xl mt-10">No requests found.</div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-blue-900 text-white">
              <tr>
                {/* ⛔️ මේවා ඔබගේ Google Sheet හි Headers වලට අනුරූප විය යුතුයි */}
                <th className="py-3 px-4 text-left">Request ID</th>
                <th className="py-3 px-4 text-left">Timestamp</th>
                <th className="py-3 px-4 text-left">Name with initials</th> {/* 'Name with initials ( මුලකුරු සමග නම)' */}
                <th className="py-3 px-4 text-left">Email address</th> {/* 'Email address (විද්යුත් තැපෑල ලිපිනය)' */}
                <th className="py-3 px-4 text-left">Requested Product</th> {/* 'Requested Product ( ඉල්ලීම සිදු කරන නිෂ්පාදනය)' */}
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request['Request ID']} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 odd:bg-white dark:odd:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-700">
                  {/* ⛔️ මේවා ඔබගේ Google Sheet හි Headers වලට අනුරූප දත්ත Properties විය යුතුයි */}
                  <td className="py-3 px-4">{request['Request ID']}</td>
                  <td className="py-3 px-4">{new Date(request.Timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4">{request['Name with initials ( මුලකුරු සමග නම)']}</td> {/* Header නම අනුව */}
                  <td className="py-3 px-4">{request['Email address (විද්යුත් තැපෑල ලිපිනය)']}</td> {/* Header නම අනුව */}
                  <td className="py-3 px-4">{request['Requested Product ( ඉල්ලීම සිදු කරන නිෂ්පාදනය)']}</td> {/* Header නම අනුව */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.Status === 'Pending'
                          ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
                          : request.Status === 'Accept' // 'Accept' ද තිබිය හැක
                          ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200'
                          : request.Status === 'Approved'
                          ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200'
                          : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200'
                      }`}
                    >
                      {request.Status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/request/${request['Request ID']}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}