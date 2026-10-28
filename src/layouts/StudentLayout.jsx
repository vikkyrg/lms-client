import React from 'react';
import { Outlet, Navigate, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  FileCheck,
  CreditCard,
  Award,
  User,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';

const StudentLayout = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/student/dashboard' },
    { label: 'My Courses', icon: BookOpen, path: '/student/courses' },
    { label: 'Quiz Results', icon: HelpCircle, path: '/student/assessments' },
    { label: 'Assignments', icon: FileCheck, path: '/student/assignments' },
    { label: 'Certificates', icon: Award, path: '/student/certificates' },
    { label: 'Billing & Receipts', icon: CreditCard, path: '/student/payments' },
    { label: 'Profile Settings', icon: User, path: '/student/profile' }
    ,{ label: 'Account Settings', icon: Settings, path: '/student/settings' }
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-gray-900">Student Portal</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/student/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
              {user.name ? user.name[0].toUpperCase() : 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h2 className="text-lg font-bold text-gray-900">Student Dashboard</h2>
          <div className="flex items-center gap-4">
            <Link
              to="/courses"
              className="text-xs font-semibold bg-indigo-600 text-white px-3.5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Browse Catalog
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
