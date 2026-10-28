import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
          <p className="text-sm text-gray-500 mt-2">Enter your email and we will send reset instructions if an account exists.</p>
        </div>
        {message && <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl">{message}</div>}
        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
        <label className="block text-sm font-semibold text-gray-700">
          Email address
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-xl" />
        </label>
        <button disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl disabled:opacity-50">
          {loading ? 'Sending...' : 'Send reset instructions'}
        </button>
        <Link to="/login" className="block text-center text-sm text-indigo-600 font-semibold">Back to sign in</Link>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
