import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      navigate('/login?reset=success', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Set a new password</h1>
          <p className="text-sm text-gray-500 mt-2">Use at least 8 characters. This link can only be used once.</p>
        </div>
        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        <input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="w-full px-3 py-2 border border-gray-300 rounded-xl" />
        <input type="password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" className="w-full px-3 py-2 border border-gray-300 rounded-xl" />
        <button disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl disabled:opacity-50">
          {loading ? 'Updating...' : 'Update password'}
        </button>
        <Link to="/login" className="block text-center text-sm text-indigo-600 font-semibold">Back to sign in</Link>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
