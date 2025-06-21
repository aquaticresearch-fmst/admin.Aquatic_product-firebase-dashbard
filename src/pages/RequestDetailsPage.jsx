// src/pages/RequestDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function RequestDetailsPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // REPLACE WITH YOUR DEPLOYED APPS SCRIPT WEB APP URL
  const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyKSqMthS7IR66S_XBlw_FQIwWW758DydvRaPnDAI7aeP42OFFR-WfwPN-CmADlOr65Rg/exec';
  const API_KEY = 'Chanuga@2025'; // MUST MATCH THE KEY IN YOUR APPS SCRIPT

  useEffect(() => {
    const fetchRequestDetails = async () => {
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

        const foundRequest = (data.requests || []).find(req => req.requestId === requestId);

        if (foundRequest) {
          foundRequest.status = foundRequest.status ? foundRequest.status.toLowerCase() : 'pending';
          setRejectionReason(foundRequest.rejectionReason || ''); 
          setRequest(foundRequest);
        } else {
          setError("Request not found.");
        }
        setLoading(false);

      } catch (err) {
        console.error("Error fetching request details:", err);
        setError("Failed to load request details: " + err.message);
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  const updateRequestStatus = async (newStatus) => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: API_KEY,
          requestId: requestId,
          newStatus: newStatus.charAt(0).toUpperCase() + newStatus.slice(1), // Send 'Accept', 'Reject', or 'Pending'
          rejectionReason: newStatus === 'reject' ? rejectionReason : '' 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status via Apps Script.");
      }

      const data = await response.json();
      if (data.success) {
        setMessage(`Request status updated to ${newStatus}. Google Apps Script will handle email.`);
        setRequest(prev => ({ 
            ...prev, 
            status: newStatus,
            rejectionReason: newStatus === 'reject' ? rejectionReason : ''
        }));
      } else {
        throw new Error(data.error || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => updateRequestStatus('accept');
  const handleReject = () => updateRequestStatus('reject');
  const handleReopen = () => updateRequestStatus('pending');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl text-gray-700 dark:text-gray-300">
        Loading Request Details...
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl text-red-700 dark:text-red-300">
        Error: {error}
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl text-gray-700 dark:text-gray-300">
        Request not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Request Details for {request.whichProductMethodologyAreYouRequesting}</h2>

        {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
        {message && <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</p>}

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p><strong>Request ID:</strong> {request.requestId || 'N/A'}</p>
          <p><strong>Product:</strong> {request.whichProductMethodologyAreYouRequesting || 'N/A'}</p>
          <p><strong>Requester Initial Name:</strong> {request.nameWithInitials || 'N/A'}</p>
          <p><strong>Requester Full Name:</strong> {request.fullName || 'N/A'}</p>
          <p><strong>Requester Email:</strong> {request.emailAddress || 'N/A'}</p>
          {request.permanentResidenceAddress && <p><strong>Permanent Address:</strong> {request.permanentResidenceAddress}</p>}
          {request.phoneNumber && <p><strong>Phone Number:</strong> {request.phoneNumber}</p>}
          {request.areYou && <p><strong>Job Status:</strong> {request.areYou}</p>} {/* This maps to "Are You?" */}
          {request.pleaseElaborateOnYourReasonForRequestingThisProductMethodology && <p><strong>Request Reason:</strong> {request.pleaseElaborateOnYourReasonForRequestingThisProductMethodology}</p>} {/* This maps to the long request reason */}
          <p><strong>Status:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            request.status === 'accept' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span></p>
          <p><strong>Requested On:</strong> {new Date(request.timestamp).toLocaleString()}</p>
          {request.emailSent && <p><strong>Email Sent Status:</strong> {request.emailSent}</p>}
          {request.expiryDate && <p><strong>Password Expiry:</strong> {request.expiryDate}</p>}
          {request.rejectionReason && <p><strong>Rejection Reason:</strong> {request.rejectionReason}</p>}
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {request.status === 'pending' && (
            <>
              <button
                onClick={handleAccept}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Accept Request'}
              </button>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Rejection Reason (Optional)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                />
                <button
                  onClick={handleReject}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Reject Request'}
                </button>
              </div>
            </>
          )}

          {(request.status === 'accept' || request.status === 'reject') && (
            <button
              onClick={handleReopen}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Re-open Request'}
            </button>
          )}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/dashboard/requests')}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            Back to Requests
          </button>
        </div>
      </div>
    </div>
  );
}