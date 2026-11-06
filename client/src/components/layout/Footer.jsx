import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/events', label: 'Events' },
    { to: '/experts', label: 'Experts' },
  ];

  const platformLinks = [
    { to: '/verticals', label: 'Verticals' },
    { to: '/membership', label: 'Membership' },
    { to: '/about', label: 'About' },
    { to: '/login?role=admin', label: 'Admin Portal' },
    { to: '/login?role=manager', label: 'Manager Portal' },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.jpeg" alt="Aethrivo" className="h-10 w-auto rounded-lg" />
              <span className="text-xl font-bold text-white tracking-wide font-heading">
                AETHRIVO
              </span>
            </Link>
            <p className="text-sm font-semibold text-primary-400 tracking-widest mb-3">
              CONNECT. LEARN. INNOVATE. GROW.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering professionals and organizations through curated learning experiences,
              expert networks, and innovation-driven growth programs.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@aethrivo.com"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  info@aethrivo.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-sm text-slate-500">
            &copy; 2026 AETHRIVO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
