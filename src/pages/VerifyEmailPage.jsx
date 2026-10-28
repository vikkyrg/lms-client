import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, message: '' });

  useEffect(() => {
    api.get(`/auth/verify-email/${token}`)
      .then((response) => setState({ loading: false, message: response.data.message }))
      .catch((error) => setState({ loading: false, message: error.response?.data?.message || 'Verification failed' }));
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{state.loading ? 'Verifying your email...' : state.message}</h1>
        {!state.loading && <Link to="/login" className="inline-block px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold">Continue to sign in</Link>}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
