import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileUpload, FaDownload } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LeadScoring = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      alert('You must be logged in to access lead scoring.');
      navigate('/login');
    } else {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('[JWT PAYLOAD]', payload);
      } catch (err) {
        console.error('Failed to decode JWT:', err);
      }
    }
  }, [navigate, token]);

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === 'text/csv') {
      setFile(uploaded);
      setError('');
    } else {
      setError('Please upload a valid CSV file.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setShowResults(false);
    setError('');

    try {
      const uploadResponse = await fetch('http://localhost:8000/api/v1/leads/upload-csv', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (uploadResponse.status === 401) throw new Error('Unauthorized');
      if (!uploadResponse.ok) throw new Error('CSV upload and scoring failed');

      const result = await uploadResponse.json();
      setResults(result.results || []);
      setDashboardData(result.dashboard || []);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      if (err.message === 'Unauthorized') {
        setError('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError('An error occurred while processing the file.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/leads/download-scored-csv?limit=100&include_empty_scores=false', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to download scored CSV');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = 'lead_scores.csv';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    } catch (err) {
      console.error(err);
      setError('Failed to download CSV.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Lead Scoring Dashboard</h1>
      

      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-3">Upload Leads CSV</h2>
        <p className="text-sm text-gray-500 mb-6">Upload a CSV file with your leads. We'll analyze and score them for insights.</p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="w-full sm:w-auto flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            <span className="text-gray-600 text-sm">Click or drag CSV file here</span>
          </label>
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <FaFileUpload /> {loading ? 'Uploading...' : 'Upload & Score'}
          </button>
        </div>

        {loading && (
          <div className="text-sm text-blue-600 mt-4 animate-pulse">
            Uploading and processing your file. Please wait...
          </div>
        )}

        {error && <p className="text-red-600 mt-4 text-sm font-medium">{error}</p>}
      </div>

      {showResults && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Scoring Results</h2>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition"
            >
              <FaDownload /> Download CSV
            </button>
          </div>

          <div className="h-72 mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#2563EB" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto mb-12">
            <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-3 px-5 border-b text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-5 border-b text-sm font-medium text-gray-600">Score</th>
                  <th className="text-left py-3 px-5 border-b text-sm font-medium text-gray-600">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {results.map((lead, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50 transition">
                    <td className="py-3 px-5">{lead.name}</td>
                    <td className="py-3 px-5">{lead.score}</td>
                    <td className="py-3 px-5">
                      {lead.score >= 80
                        ? 'Hot Lead 🔥'
                        : lead.score >= 60
                        ? 'Warm Lead 🌤️'
                        : 'Cold Lead ❄️'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {dashboardData.length > 0 && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Top Leads Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData.map((lead) => (
                  <div key={lead.id} className="bg-gray-50 shadow-md rounded-lg p-4">
                    <h3 className="font-bold text-lg">{lead.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {lead.job_title} @ {lead.company}
                    </p>
                    <ul className="text-sm space-y-1">
                      <li><strong>Score:</strong> {lead.score.toFixed(2)} ({lead.interpretation})</li>
                      <li><strong>Category:</strong> {lead.category}</li>
                      <li><strong>Visits:</strong> {lead.website_visits} | Views: {lead.page_views}</li>
                      <li><strong>Time Spent:</strong> {lead.time_spent}s</li>
                      <li><strong>Source:</strong> {lead.source}</li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadScoring;
