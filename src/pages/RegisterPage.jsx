import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, ArrowRight, GraduationCap } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/student/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/90 shadow-[0_4px_25px_rgba(18,41,75,0.06)] space-y-6">
        
        {/* Top Brand Badge */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#FFF2BF] text-[#102747] border border-[#F4D36B]/60 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
            <GraduationCap className="h-7 w-7 text-[#173563] stroke-[2.2]" />
          </div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#3F6FA8] block">
            Start Learning
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102747] tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Sign up to enroll in courses, access materials, and submit projects
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#102747] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#102747] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#102747] uppercase tracking-wider mb-1.5">
              Password (Min. 6 Characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173563]/10 focus:border-[#173563] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#173563] hover:bg-[#102747] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up Free'}</span>
            <ArrowRight className="h-4 w-4 text-[#F4D36B]" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="font-bold text-[#173563] hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
