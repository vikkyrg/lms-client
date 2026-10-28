import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../assests/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#102747] text-gray-300 pt-16 pb-12 border-t border-[#173563]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block bg-white/95 px-3 py-2 rounded-xl transition hover:bg-white">
              <img
                src={logoImg}
                alt="AutoOps School — Learn. Build. Automate."
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Learn. Build. Automate. Practical IT training for students, fresh graduates, career switchers, and early-career professionals.
            </p>
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-[#F4D36B]" />
                autoopsschool@gmail.com
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400"><Phone className="h-4 w-4 text-[#F4D36B]" />+91 74830 85370</div>
            <div className="flex items-center gap-2 text-sm text-gray-400"><MapPin className="h-4 w-4 text-[#F4D36B]" />Bengaluru, Karnataka, India</div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses" className="hover:text-white transition">All Courses</Link></li>
              <li><Link to="/courses?isFree=true" className="hover:text-white transition">Free Tutorials</Link></li>
              <li><Link to="/courses?category=devops" className="hover:text-white transition">DevOps Courses</Link></li>
              <li><Link to="/projects" className="hover:text-white transition">Projects</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>DevOps Engineering</li>
              <li>Java Full Stack Development</li>
              <li>Python Full Stack Development</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Support & Policy</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/contact" className="hover:text-white transition">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AutoOps School. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern MERN architecture for high-performance learning.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
