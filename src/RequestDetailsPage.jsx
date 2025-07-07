// src/RequestDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RequestDetailsPage.css'; // ඔබට මෙම CSS ගොනුව තිබේ නම්

export default function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  // ⛔️ මෙය ඔබගේ සැබෑ Google Apps Script Web App URL එක සමඟ ආදේශ කරන්න
  const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzKupN_mR5fLIbSwyLQbbPBPLHjud2QPo2SHr1vDFCVj32yOlME7K4cOboxGQyd4HXd/exec';

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        // සියලු requests ලබාගෙන, පසුව frontend එකේදී filter කරන්න
        const response = await fetch(APPS_SCRIPT_WEB_APP_URL); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allRequests = await response.json(); 

        if (Array.isArray(allRequests)) {
          const foundRequest = allRequests.find(req => req['Request ID'] === id);
          if (foundRequest) {
            setRequest(foundRequest);
            setNewStatus(foundRequest.Status);
          } else {
            setError("Request not found for this ID.");
          }
        } else {
          setError('Received data is not an array.');
        }
      } catch (err) {
        setError(`Failed to fetch request details: ${err.message}`);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id, APPS_SCRIPT_WEB_APP_URL]);

  const handleStatusUpdate = async () => {
    if (!newStatus || !request) return;

    setUpdateMessage('Updating status...');
    try {
      const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 'action' property එක Apps Script doPost function එකේ භාවිත කරන්නේ නම් මෙය තබා ගන්න.
          // ඔබගේ දැනට පවතින doPost function එකේ action property එකක් check කරන්නේ නැහැ.
          // ඒ නිසා මෙය අත්‍යවශ්‍ය නොවේ, නමුත් අනාගතයේදී හොඳ පුරුද්දකි.
          action: 'updateRequestStatus', 
          requestId: request['Request ID'], 
          status: newStatus, // Apps Script එකේ doPost එක 'status' කියල බලන්නේ
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result.success) {
        setRequest(prev => ({ ...prev, Status: newStatus }));
        setUpdateMessage('Status updated successfully!');
      } else {
        setUpdateMessage(`Failed to update status: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      setUpdateMessage(`Error updating status: ${err.message}`);
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        Loading request details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-600 dark:text-red-400">
        Error: {error}
        <button
          onClick={() => navigate('/requests')}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to All Requests
        </button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        No request found for ID: {id}
        <button
          onClick={() => navigate('/requests')}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to All Requests
        </button>
      </div>
    );
  }

  return (
    <div className="request-details-container bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-200 mb-6 text-center">
        Request Details
      </h1>

      <div className="details-card bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        {/* ⛔️ මේවා ඔබගේ Google Sheet හි Headers වලට අනුරූප දත්ත Properties විය යුතුයි */}
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Request ID:</span>
          {request['Request ID']}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Timestamp:</span>
          {new Date(request.Timestamp).toLocaleString()}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Name with initials:</span>
          {request['Name with initials ( මුලකුරු සමග නම)']}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Full Name:</span>
          {request['Full Name ( සම්පූර්ණ නම)']}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Email address:</span>
          {request['Email address (විද්යුත් තැපෑල ලිපිනය)']}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Permanent residence address:</span>
          {request['Permanent residence address (ස්ථිර පදිංචි ලිපිනය)']}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Phone number:</span>
          {request['Phone number (දුරකථන අංකය)']}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Are You?:</span>
          {request['Are You?']}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Requested Product:</span>
          {request['Requested Product ( ඉල්ලීම සිදු කරන නිෂ්පාදනය)']}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Reason for request:</span>
          {request['Please explain the reason for your request.(ඔබේ ඉල්ලීමට හේතුව විස්තර කරන්න.)']}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Reason for request:</span>
          {request['Describe what you hope to accomplish by making this product.(මෙම නිෂ්පාදනය සිදු කිරීමෙන්, ඔබ ඉටු කර ගැනීමට බලාපොරොත්තු වන දේ විස්තර කරන්න.)']}
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Current Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              request.Status === 'Pending'
                ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
                : request.Status === 'Accept' || request.Status === 'Approved'
                ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200'
                : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200'
            }`}
          >
            {request.Status}
          </span>
        </p>
        {/* ඔබට reason සඳහා වෙනම තීරුවක් තිබේ නම් මෙහි පෙන්විය හැක */}
        {/* {request.Reason && ( 
          <p className="flex items-center mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Reason (if Rejected):</span>
            {request.Reason}
          </p>
        )} */}
      </div>

      <div className="status-update-section bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-4">Update Request Status</h2>
        <div className="flex items-center space-x-4">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Accept">Accept</option> {/* 'Accept' option එක අනිවාර්යයෙන්ම තිබිය යුතුයි */}
            <option value="Reject">Reject</option> {/* 'Reject' option එකත් තබා ගන්න */}
          </select>
          <button
            onClick={handleStatusUpdate}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Update Status
          </button>
        </div>
        {updateMessage && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {updateMessage}
          </p>
        )}
      </div>

      <button
        onClick={() => navigate('/requests')}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 block mx-auto"
      >
        ← Back to All Requests
      </button>
    </div>
  );
}