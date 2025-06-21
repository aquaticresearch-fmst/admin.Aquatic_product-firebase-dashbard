// src/pages/RequestManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// The 'filter' prop is passed from App.js now
export default function RequestManagement({ filter: initialFilter = 'all' }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(initialFilter); // Use initialFilter for the default state

  // REPLACE WITH YOUR DEPLOYED APPS SCRIPT WEB APP URL
  const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyKSqMthS7IR66S_XBlw_FQIwWW758DydvRaPnDAI7aeP42OFFR-WfwPN-CmADlOr65Rg/exec';
  const API_KEY = 'Chanuga@2025'; // MUST MATCH THE KEY IN YOUR APPS SCRIPT

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${APPS_SCRIPT_WEB_APP_URL}?api_key=${API_KEY}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data from Apps Script.");
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        const loadedRequests = data.requests || [];
        
        loadedRequests.forEach(req => {
            if (req.status) {
                req.status = req.status.toLowerCase();
            } else {
                req.status = 'pending'; 
            }
        });

        // Sort requests by timestamp (most recent first)
        loadedRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setRequests(loadedRequests);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load requests: " + err.message);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []); // Empty dependency array means this runs once on mount

  // Update the local filter state if the initialFilter prop changes (e.g., navigating from sidebar)
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);


  const filteredRequests = requests.filter(request => {
    if (filter === 'all' || !filter) return true; // Show all if 'all' or filter is not explicitly set
    return request.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl text-gray-700 dark:text-gray-300">
        Loading Requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl text-red-700 dark:text-red-300">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          {filter === 'all' && 'All Methodology Access Requests'}
          {filter === 'pending' && 'Pending Methodology Access Requests'}
          {filter === 'accept' && 'Accepted Methodology Access Requests'}
          {filter === 'reject' && 'Rejected Methodology Access Requests'}
        </h2>

        {/* Filter buttons - these will update the local 'filter' state */}
        <div className="mb-4 flex justify-center space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            Pending ({requests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('accept')}
            className={`px-4 py-2 rounded-md ${filter === 'accept' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            Accepted ({requests.filter(r => r.status === 'accept').length})
          </button>
          <button
            onClick={() => setFilter('reject')}
            className={`px-4 py-2 rounded-md ${filter === 'reject' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            Rejected ({requests.filter(r => r.status === 'reject').length})
          </button>
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No requests found for this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-200 dark:bg-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Requested On</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredRequests.map((request) => (
                  <tr key={request.requestId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {request.whichProductMethodologyAreYouRequesting || 'N/A'} {/* This maps to "Product" */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {request.fullName || request.nameWithInitials || 'N/A'} {/* Full Name first, then Initials */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {request.emailAddress || 'N/A'} {/* This maps to "Email address" */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accept' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(request.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/dashboard/requests/${request.requestId}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200">
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
    </div>
  );
}