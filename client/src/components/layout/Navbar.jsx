import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Shield, UserCheck, ChevronDown, Layers } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const nineVerticals = [
  { slug: 'ipr', name: 'Aethrivo IPR' },
  { slug: 'academy', name: 'Aethrivo Academy' },
  { slug: 'skills', name: 'Aethrivo Skills' },
  { slug: 'research', name: 'Aethrivo Research' },
  { slug: 'corporate', name: 'Aethrivo Corporate' },
  { slug: 'conferences', name: 'Aethrivo Conferences' },
  { slug: 'talent', name: 'Aethrivo Talent' },
  { slug: 'wellbeing', name: 'Aethrivo Wellbeing' },
  { slug: 'mou-collaborations', name: 'Aethrivo MoU & Collaborations' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [verticalsDropdownOpen, setVerticalsDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVerticalsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    isActive(path)
      ? 'text-primary-600 font-bold'
      : 'text-slate-600 hover:text-primary-600 transition-colors font-medium';

  return (
    <nav className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-white/20 bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.jpeg" alt="Aethrivo" className="h-10 w-auto rounded-xl shadow-xs" />
            <div className="flex flex-col">
              <span className="text-xl font-black gradient-text tracking-wide font-heading leading-tight">
                AETHRIVO
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider hidden sm:block">
                CONNECT • LEARN • INNOVATE • GROW
              </span>
            </div>
          </Link>

          {/* Center: Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className={`text-sm ${linkClass('/')}`}>
              Home
            </Link>

            {/* Verticals Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setVerticalsDropdownOpen(!verticalsDropdownOpen)}
                className={`text-sm inline-flex items-center gap-1 ${linkClass('/verticals')}`}
              >
                <span>Verticals</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${verticalsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {verticalsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">9 Core Business Verticals</span>
                    <Link
                      to="/verticals"
                      onClick={() => setVerticalsDropdownOpen(false)}
                      className="text-[11px] font-bold text-primary-600 hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-0.5">
                    {nineVerticals.map((vert, idx) => (
                      <Link
                        key={vert.slug}
                        to={`/verticals/${vert.slug}`}
                        onClick={() => setVerticalsDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <span className="truncate">{vert.name}</span>
                        <span className="text-[10px] text-slate-400">0{idx + 1}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/courses" className={`text-sm ${linkClass('/courses')}`}>
              Courses
            </Link>
            <Link to="/events" className={`text-sm ${linkClass('/events')}`}>
              Events
            </Link>
            <Link to="/experts" className={`text-sm ${linkClass('/experts')}`}>
              Experts
            </Link>
            <Link to="/about" className={`text-sm ${linkClass('/about')}`}>
              About
            </Link>
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
                <Link to="/membership" className="btn-primary text-sm px-4 py-2 shadow-sm shadow-primary-500/20">
                  Join Free
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
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1 border-t border-slate-200 bg-white">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm ${linkClass('/')}`}
          >
            Home
          </Link>
          <Link
            to="/verticals"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm ${linkClass('/verticals')}`}
          >
            Verticals
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm ${linkClass('/courses')}`}
          >
            Courses (20 Flagship)
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm ${linkClass('/events')}`}
          >
            Events & Symposiums
          </Link>
          <Link
            to="/experts"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm ${linkClass('/experts')}`}
          >
            Experts Directory
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm ${linkClass('/about')}`}
          >
            About Aethrivo
          </Link>

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
                  Join Free
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
