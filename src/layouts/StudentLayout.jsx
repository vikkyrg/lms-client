import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import logoImg from '../assests/logo.png';

/**
 * Student dashboard shell.
 *
 * Sidebar navigation (final): Overview · Learning · Certificates ·
 * Billing & Receipts · Account Settings. "My Courses" was intentionally
 * removed — enrolled-course access lives in Overview and the Learning hub.
 *
 * Responsive behavior:
 * - Desktop/tablet (md+): fixed, permanently expanded white sidebar.
 * - Mobile (<md): slide-in drawer opened from the header hamburger,
 *   with a dimmed overlay; closes on navigation or overlay click.
 */
const StudentLayout = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Close the mobile drawer whenever the route changes
    setDrawerOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#2B6FE0] border-t-transparent rounded-full" />
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
    { label: 'Overview', icon: LayoutDashboard, path: '/student/dashboard', end: true },
    { label: 'Learning', icon: GraduationCap, path: '/student/learning' },
    { label: 'Certificates', icon: Award, path: '/student/certificates' },
    { label: 'Billing & Receipts', icon: CreditCard, path: '/student/payments' },
    { label: 'Account Settings', icon: Settings, path: '/student/settings' }
  ];

  const sidebarInner = (showCloseButton) => (
    <>
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          {showCloseButton && (
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="md:hidden ml-auto p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoImg} alt="AutoOps School" className="h-9 w-auto object-contain" />
            <span className="font-extrabold text-sm text-[#142B50] tracking-tight border-l border-gray-200 pl-2">
              Student
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#EAF2FC] text-[#2B6FE0] shadow-2xs'
                    : 'text-gray-600 hover:text-[#173563] hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Card & Logout */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-[#EAF2FC] text-[#173563] font-bold flex items-center justify-center text-sm shrink-0 border border-[#D0E2F6]">
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
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-[#0A1428]/45 z-40 md:hidden transition-opacity"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: slide-in drawer on mobile, permanently expanded on tablet/desktop */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col justify-between z-50 shrink-0
          fixed inset-y-0 left-0 w-72 transition-transform duration-300 ease-out overflow-y-auto
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:h-auto md:inset-auto md:sticky md:top-0 md:self-start md:h-screen md:overflow-y-auto md:w-64`}
        aria-label="Student dashboard navigation"
      >
        {sidebarInner(true)}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-xl text-[#173563] hover:bg-gray-100 transition cursor-pointer"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="md:hidden flex items-center">
              <img src={logoImg} alt="AutoOps School" className="h-8 w-auto object-contain" />
            </Link>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 hidden sm:block">
              Student Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/courses"
              className="text-xs font-semibold bg-[#142B50] text-white px-3.5 py-2 rounded-xl hover:bg-[#2B6FE0] transition"
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
