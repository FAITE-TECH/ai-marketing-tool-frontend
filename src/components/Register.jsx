import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username: name,
          password,
          role,
          is_active: isActive,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setSuccess(true);

        // ✅ Save token to localStorage
        localStorage.setItem('access_token', data.access_token);

        // ✅ Redirect after 2 seconds
        setTimeout(() => navigate('/'), 2000);
      } else {
        alert(data.detail || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 relative">
      {success && (
        <div className="absolute top-5">
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-lg animate-fadeIn">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">Registration successful. Redirecting to home...</span>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Create Account</h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
              placeholder="Your Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">Is Active</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
