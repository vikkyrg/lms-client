import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import api from '../services/api';
import logoImg from '../assests/logo.png';

const exploreLinks = [
  { name: 'All Courses', path: '/courses' },
  { name: 'Projects', path: '/projects' },
  { name: 'About Us', path: '/about' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Career Support', path: '/career-support' },
  { name: 'FAQs', path: '/faq' }
];

const policyLinks = [
  { name: 'Contact Us / Enquiry', path: '/contact' },
  { name: 'Terms of Service', path: '/terms' },
  { name: 'Privacy Policy', path: '/privacy-policy' }
];

// Fallback shown only when no published courses come back from the course API.
const fallbackPrograms = [
  { name: 'Java Full Stack Development', path: '/courses?search=Java' },
  { name: 'Python Full Stack Development', path: '/courses?search=Python' },
  { name: 'DevOps Training', path: '/courses?search=DevOps' },
  { name: 'AWS Training', path: '/courses?search=AWS' }
];

const ColumnTitle = ({ children }) => (
  <h4 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
    {children}
    <span className="mt-3 block h-px w-7 bg-[#F5CE62]/70" aria-hidden="true" />
  </h4>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="group relative inline-block text-sm leading-relaxed text-[#B8C5D8] transition-colors duration-200 hover:text-[#F5CE62]"
  >
    {children}
    <span
      className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#F5CE62] transition-all duration-300 group-hover:w-full"
      aria-hidden="true"
    />
  </Link>
);

const ContactRow = ({ icon: Icon, children }) => (
  <li className="flex items-start gap-2.5 text-sm leading-relaxed text-[#B8C5D8]">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#F5CE62]" />
    <span className="break-words">{children}</span>
  </li>
);

const Footer = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      try {
        const res = await api.get('/courses?sort=popular&limit=6');
        if (!isMounted) return;
        const list = (res.data.courses || []).map((course) => ({
          name: course.title,
          path: `/courses/${course.slug || course._id}`
        }));
        setPrograms(list);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPrograms();
    return () => {
      isMounted = false;
    };
  }, []);

  const programList = programs.length > 0 ? programs : fallbackPrograms;

  return (
    <footer className="bg-[#102747] text-[#B8C5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-10 gap-y-9 py-11 sm:py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.25fr_1fr] lg:gap-y-10 lg:py-16">
          {/* Brand Identity */}
          <div className="lg:pr-6">
            <Link to="/" className="inline-flex items-center rounded-md bg-white px-2.5 py-2" aria-label="AutoOps School — Learn. Build. Automate.">
              <img
                src={logoImg}
                alt="AutoOps School — Learn. Build. Automate."
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 text-sm font-semibold tracking-wide text-white">
              Learn. Build. Automate.
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#B8C5D8]">
              Practical IT training for students, fresh graduates, career switchers, and early-career IT professionals.
            </p>
            <ul className="mt-5 space-y-2.5">
              <ContactRow icon={Mail}>
                <a
                  href="mailto:autoopsschool@gmail.com"
                  className="transition-colors duration-200 hover:text-[#F5CE62]"
                >
                  autoopsschool@gmail.com
                </a>
              </ContactRow>
              <ContactRow icon={Phone}>
                <a href="tel:+917483085370" className="transition-colors duration-200 hover:text-[#F5CE62]">
                  +91 74830 85370
                </a>
              </ContactRow>
              <ContactRow icon={MapPin}>Bengaluru, Karnataka, India</ContactRow>
              <ContactRow icon={Globe}>
                <a
                  href="https://autoopsschool.in"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-200 hover:text-[#F5CE62]"
                >
                  autoopsschool.in
                </a>
              </ContactRow>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <ColumnTitle>Explore</ColumnTitle>
            <ul className="mt-5 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <FooterLink to={link.path}>{link.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Training Programs */}
          <div>
            <ColumnTitle>Training Programs</ColumnTitle>
            <ul className="mt-5 space-y-2.5">
              {programList.map((program, index) => (
                <li key={`${program.name}-${index}`}>
                  <FooterLink to={program.path}>{program.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <ColumnTitle>Support &amp; Policies</ColumnTitle>
            <ul className="mt-5 space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <FooterLink to={link.path}>{link.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-white/10 py-6 text-xs text-[#B8C5D8]/85 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} AutoOps School. All rights reserved.</p>
          <p>IT Training &amp; Technical Education · Bengaluru, Karnataka, India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
