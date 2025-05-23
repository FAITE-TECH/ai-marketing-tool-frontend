import React, { useState } from 'react';
import { FaFileUpload, FaDownload } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LeadScoring = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

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
    const token = localStorage.getItem('access_token');
    if (!file) {
      setError('No file selected.');
      return;
    }
    if (!token) {
      setError('User not authenticated.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch('http://localhost:8000/api/v1/leads/upload-csv', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('CSV upload failed');
      }

      const scoreResponse = await fetch('http://localhost:8000/api/v1/leads/score-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!scoreResponse.ok) {
        throw new Error('Scoring failed');
      }

      const scoredCsvResponse = await fetch('http://localhost:8000/api/v1/leads/download-scored-csv', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!scoredCsvResponse.ok) {
        throw new Error('Failed to fetch scored CSV');
      }

      const csvText = await scoredCsvResponse.text();
      const lines = csvText.trim().split('\n').slice(1); // skip header
      const parsed = lines.map((line) => {
        const [name, score] = line.split(',');
        return { name, score: parseInt(score) };
      });

      setData(parsed);
      setShowResults(true);
      setError('');
    } catch (err) {
      console.error(err);
      setError('An error occurred while processing the file.');
    }
  };

  const handleDownload = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('http://localhost:8000/api/v1/leads/download-scored-csv', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download scored CSV');
      }

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

      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-3">Upload Leads CSV</h2>
        <p className="text-sm text-gray-500 mb-6">
          Upload a CSV file with your leads. We'll analyze and score them for insights.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="w-full sm:w-auto flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            <span className="text-gray-600 text-sm">Click or drag CSV file here</span>
          </label>
          <button
            onClick={handleUpload}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            <FaFileUpload /> Upload & Score
          </button>
        </div>

        {error && <p className="text-red-600 mt-4 text-sm font-medium">{error}</p>}
      </div>

      {/* Results */}
      {showResults && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Scoring Results</h2>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition"
            >
              <FaDownload /> Download CSV
            </button>
          </div>

          {/* Chart */}
          <div className="h-72 mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#2563EB" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-3 px-5 border-b text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-5 border-b text-sm font-medium text-gray-600">Score</th>
                  <th className="text-left py-3 px-5 border-b text-sm font-medium text-gray-600">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {data.map((lead, idx) => (
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
        </div>
      )}
    </div>
  );
};

export default LeadScoring;
