import { Link } from 'react-router-dom';
import { Mail, Phone, Shield } from 'lucide-react';

export default function Footer() {
  const verticalsList = [
    { to: '/verticals/ipr', label: 'Aethrivo IPR' },
    { to: '/verticals/academy', label: 'Aethrivo Academy' },
    { to: '/courses', label: 'Aethrivo Skills' },
    { to: '/verticals/research', label: 'Aethrivo Research' },
    { to: '/verticals/corporate', label: 'Aethrivo Corporate' },
    { to: '/events', label: 'Aethrivo Conferences' },
    { to: '/experts', label: 'Aethrivo Talent' },
    { to: '/verticals/wellbeing', label: 'Aethrivo Wellbeing' },
    { to: '/verticals/mou-collaborations', label: 'Aethrivo MoU & Collaborations' },
  ];

  const platformLinks = [
    { to: '/verticals', label: 'All 9 Verticals' },
    { to: '/courses', label: 'Course Catalogue (20)' },
    { to: '/membership', label: 'Free Membership' },
    { to: '/about', label: 'About Aethrivo' },
    { to: '/login?role=admin', label: 'Admin Portal' },
    { to: '/login?role=manager', label: 'Manager Portal' },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand (2 cols on large) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.jpeg" alt="Aethrivo" className="h-10 w-auto rounded-lg" />
              <span className="text-xl font-bold text-white tracking-wide font-heading">
                Aethrivo
              </span>
            </Link>
            <p className="text-xs font-bold text-primary-400 tracking-widest mb-3 uppercase">
              CONNECT. LEARN. INNOVATE. GROW.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
              One platform connecting learners, faculty, researchers, experts, institutions and industry to skills, knowledge, consultancy and collaboration.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>Free membership for students, faculty, and industry.</p>
              <p>Nine dedicated service verticals with verified workflows.</p>
            </div>
          </div>

          {/* Column 2: The 9 Verticals */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Core Verticals
            </h3>
            <ul className="space-y-2">
              {verticalsList.slice(0, 5).map((vert) => (
                <li key={vert.to}>
                  <Link
                    to={vert.to}
                    className="text-xs text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    {vert.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Verticals (cont.) */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Collaborations & More
            </h3>
            <ul className="space-y-2">
              {verticalsList.slice(5).map((vert) => (
                <li key={vert.to}>
                  <Link
                    to={vert.to}
                    className="text-xs text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    {vert.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/verticals"
                  className="text-xs font-semibold text-primary-400 hover:underline inline-block mt-1"
                >
                  View All 9 Verticals →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Access */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2 mb-6">
              {platformLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">
              Contact Desk
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a href="mailto:info@aethrivo.com" className="hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary-400" /> info@aethrivo.com
                </a>
              </li>
              <li>
                <a href="tel:+918000000000" className="hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary-400" /> +91 80 0000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Aethrivo. All rights reserved. Functional Website Blueprint V1.0.</p>
          <p className="text-slate-400">
            Designed by{' '}
            <a
              href="https://my-portfolio-one-gilt-57.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 hover:underline font-medium transition-colors"
            >
              Mainuddin Khudavand
            </a>
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300">Privacy Notice</Link>
            <Link to="/about" className="hover:text-slate-300">Terms of Use</Link>
            <Link to="/about" className="hover:text-slate-300">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
