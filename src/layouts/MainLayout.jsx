import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />
      {/* Animated page wrapper with subtle smooth entrance on pathname change */}
      <main key={location.pathname} className="flex-1 animate-fade-in-up">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
