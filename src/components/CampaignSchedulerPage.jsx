import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CampaignEditor = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState('active');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState(null); // ✅ To hold backend response

  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      alert('You must be logged in to access this page.');
      navigate('/login');
    }
  }, [navigate, token]);

  const handleSave = async () => {
    setError('');
    setIsSaving(true);
    setResult(null); // Clear previous result

    const payload = {
      name,
      description,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      target_audience: targetAudience,
      budget: Number(budget),
      status,
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/social/campaigns',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Campaign created successfully!');
      setResult(response.data); // ✅ Store response in state

    } catch (error) {
      console.error('Error creating campaign:', error.response?.data || error.message);
      setError('Failed to create campaign. Please try again.');
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Campaign</h1>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Campaign Name"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Campaign Description"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Target Audience</label>
          <input
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="e.g., students, professionals"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="e.g., 5000"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`text-white px-4 py-2 rounded ${
          isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSaving ? 'Saving...' : 'Save Campaign'}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
  <div className="mt-6 p-4 border rounded bg-green-100 text-green-800">
    <h2 className="text-lg font-semibold mb-4 text-green-900">🎉 Campaign Created Successfully!</h2>
    <table className="table-auto w-full text-left text-sm bg-white border rounded shadow-sm">
      <tbody>
        <tr>
          <th className="px-4 py-2 border-b font-medium">ID</th>
          <td className="px-4 py-2 border-b">{result.id}</td>
        </tr>
        <tr>
          <th className="px-4 py-2 border-b font-medium">Name</th>
          <td className="px-4 py-2 border-b">{result.name}</td>
        </tr>
        <tr>
          <th className="px-4 py-2 border-b font-medium">Description</th>
          <td className="px-4 py-2 border-b">{result.description}</td>
        </tr>
        <tr>
          <th className="px-4 py-2 border-b font-medium">Start Date</th>
          <td className="px-4 py-2 border-b">{new Date(result.start_date).toLocaleString()}</td>
        </tr>
        <tr>
          <th className="px-4 py-2 border-b font-medium">End Date</th>
          <td className="px-4 py-2 border-b">{new Date(result.end_date).toLocaleString()}</td>
        </tr>
        <tr>
          <th className="px-4 py-2 border-b font-medium">Target Audience</th>
          <td className="px-4 py-2 border-b">{result.target_audience}</td>
        </tr>
        <tr>
          <th className="px-4 py-2 border-b font-medium">Budget</th>
          <td className="px-4 py-2 border-b">${result.budget}</td>
        </tr>
        <tr>
          <th className="px-4 py-2 border-b font-medium">Status</th>
          <td className="px-4 py-2 border-b capitalize">{result.status}</td>
        </tr>
        <tr>
          <th className="px-4 py-2 border-b font-medium">Created At</th>
          <td className="px-4 py-2 border-b">{new Date(result.created_at).toLocaleString()}</td>
        </tr>
        {result.updated_at && (
          <tr>
            <th className="px-4 py-2 border-b font-medium">Updated At</th>
            <td className="px-4 py-2 border-b">{new Date(result.updated_at).toLocaleString()}</td>
          </tr>
        )}
        {/* <tr>
          <th className="px-4 py-2 border-b font-medium">Created By</th>
          <td className="px-4 py-2 border-b">{result.created_by_id}</td>
        </tr> */}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default CampaignEditor;
