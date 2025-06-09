import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ScheduledCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      alert('You must be logged in to access this page.');
      navigate('/login');
      return;
    }

    const fetchScheduledCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/social/process-scheduled-posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCampaigns(response.data || []);
      } catch (error) {
        console.error('Error fetching scheduled campaigns:', error.response?.data || error.message);
        setError('Failed to load scheduled campaigns.');
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledCampaigns();
  }, [navigate, token]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Scheduled Campaigns</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : campaigns.length === 0 ? (
        <p>No scheduled campaigns found.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border-b">Name</th>
              <th className="p-3 text-left border-b">Start Date</th>
              <th className="p-3 text-left border-b">End Date</th>
              <th className="p-3 text-left border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3">{campaign.name}</td>
                <td className="p-3">{new Date(campaign.start_date).toLocaleString()}</td>
                <td className="p-3">{new Date(campaign.end_date).toLocaleString()}</td>
                <td className="p-3 capitalize">{campaign.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScheduledCampaigns;
