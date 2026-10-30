import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, BookOpen, LogOut, Search } from 'lucide-react';
import logoImg from '../assests/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === path) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      navigate(path);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Career Support', path: '/career-support' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo - using logo.png */}
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center shrink-0 group py-1"
          >
            <img
              src={logoImg}
              alt="AutoOps School — Learn. Build. Automate."
              className="h-14 sm:h-16 md:h-[70px] w-auto object-contain transition group-hover:opacity-90"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`relative text-sm font-semibold transition py-1 ${
                    active
                      ? 'text-[#173563] font-bold'
                      : 'text-gray-600 hover:text-[#173563]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F4D36B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/courses"
              className="p-2 text-gray-500 hover:text-[#173563] hover:bg-gray-50 rounded-xl transition"
              title="Search courses"
            >
              <Search className="h-5 w-5" />
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/student/dashboard"
                  className="flex items-center gap-2 text-xs font-semibold text-[#173563] bg-[#FFFAE9] border border-[#FFF2BF] hover:bg-[#FFF2BF] px-3.5 py-2 rounded-xl transition shadow-2xs"
                >
                  <BookOpen className="h-4 w-4 text-[#3F6FA8]" />
                  My Dashboard
                </Link>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#173563] text-[#F4D36B] font-bold flex items-center justify-center text-xs shadow-2xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-[#344054] hover:text-[#173563] px-3.5 py-2 rounded-xl hover:bg-gray-50 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-bold text-[#102747] bg-[#F4D36B] hover:bg-[#ebd068] px-4 py-2.5 rounded-xl shadow-xs transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden gap-2">
            <Link
              to="/courses"
              className="p-2 text-gray-500 hover:text-[#173563] rounded-lg"
            >
              <Search className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-[#173563] hover:bg-gray-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fade-in-up">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick(e, link.path);
              }}
              className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive(link.path)
                  ? 'bg-[#FFFAE9] text-[#173563] font-bold border-l-4 border-[#F4D36B]'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#173563]'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#173563] bg-[#FFFAE9]"
                >
                  <BookOpen className="h-4 w-4" />
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 border border-gray-300 rounded-xl font-semibold text-[#344054] text-xs hover:bg-gray-50 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-[#F4D36B] hover:bg-[#ebd068] text-[#102747] rounded-xl font-bold text-xs shadow-xs transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
