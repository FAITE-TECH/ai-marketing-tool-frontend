import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('You are not logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          alert(data.detail || 'Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
        No user data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Your Profile</h2>

        <div className="space-y-4">
          <div>
            <span className="font-semibold">Username:</span> {user.username}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Role:</span> {user.role}
          </div>
          <div>
            <span className="font-semibold">Active:</span> {user.is_active ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-semibold">User ID:</span> {user.id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
