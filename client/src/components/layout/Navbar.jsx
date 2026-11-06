import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/events', label: 'Events' },
    { to: '/experts', label: 'Experts' },
    { to: '/verticals', label: 'Verticals' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    isActive(path)
      ? 'text-primary-600 font-semibold'
      : 'text-slate-600 hover:text-primary-600 transition-colors';

  return (
    <nav className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.jpeg" alt="Aethrivo" className="h-10 w-auto rounded-lg" />
            <span className="text-xl font-bold gradient-text tracking-wide font-heading">
              AETHRIVO
            </span>
          </Link>

          {/* Center: Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`text-sm font-medium ${linkClass(link.to)}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Auth Buttons / User Info */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-600">
                  Hello, <span className="font-semibold text-slate-800">{user.name}</span>
                </span>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/manager'}
                  className="btn-secondary text-sm px-4 py-2 inline-flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="btn-outline text-sm px-4 py-2 inline-flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/membership" className="btn-primary text-sm px-4 py-2">
                  Become a Member
                </Link>
                <Link
                  to="/login?role=admin"
                  className="btn-outline text-sm px-3.5 py-2 inline-flex items-center gap-1.5 font-medium hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  <Shield className="w-4 h-4 text-primary-600" />
                  Admin
                </Link>
                <Link
                  to="/login?role=manager"
                  className="btn-outline text-sm px-3.5 py-2 inline-flex items-center gap-1.5 font-medium hover:border-violet-500 hover:text-violet-600 transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-violet-600" />
                  Manager
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile: Slide-down Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1 border-t border-white/20">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${linkClass(link.to)} hover:bg-slate-50`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <>
                <p className="px-3 text-sm text-slate-500">
                  Signed in as <span className="font-semibold text-slate-700">{user.name}</span>
                </p>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/manager'}
                  onClick={() => setMobileOpen(false)}
                  className="block w-full btn-secondary text-sm px-4 py-2.5 text-center"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="block w-full btn-outline text-sm px-4 py-2.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/membership"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full btn-primary text-sm px-4 py-2.5 text-center"
                >
                  Become a Member
                </Link>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login?role=admin"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline text-sm py-2 text-center flex items-center justify-center gap-1.5"
                  >
                    <Shield className="w-4 h-4 text-primary-600" />
                    Admin
                  </Link>
                  <Link
                    to="/login?role=manager"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline text-sm py-2 text-center flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4 text-violet-600" />
                    Manager
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
