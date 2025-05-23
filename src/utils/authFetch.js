// src/utils/authFetch.js

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found. Please login.');
  }

  const headers = {
    ...options.headers,
    'Authorization': token,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    // Handle session expiration or error response
    if (response.status === 401) {
      alert('Session expired. Please login again.');
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page
    }
    throw new Error('Error fetching data');
  }

  return response.json();
};

export default authFetch;
