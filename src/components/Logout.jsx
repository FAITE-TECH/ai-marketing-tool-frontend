import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('logging-out'); // 'logging-out' → 'success'

  useEffect(() => {
    // Step 1: Logging out message for 3 seconds
    const logoutTimer = setTimeout(() => {
      localStorage.removeItem('access_token'); // clear token
      setStatus('logged-out'); // update status to success
    }, 3000);

    // Step 2: Redirect after 1.5 seconds from showing success
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 4500);

    return () => {
      clearTimeout(logoutTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 relative">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        {status === 'logging-out' ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Logging out...</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we process your logout.</p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-green-700 mb-4">Logged out successfully!</h2>
            <p className="text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Logout;
