import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Mail, Lock, ArrowLeft, Eye, EyeOff, Shield, UserCheck, KeyRound, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'manager' ? 'manager' : 'admin';
  const [role, setRole] = useState(initialRole);

  const envAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@aethrivo.com';
  const envAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@123';
  const envManagerEmail = import.meta.env.VITE_MANAGER_EMAIL || 'manager@aethrivo.com';
  const envManagerPassword = import.meta.env.VITE_MANAGER_PASSWORD || 'Manager@123';

  const [email, setEmail] = useState(initialRole === 'admin' ? envAdminEmail : envManagerEmail);
  const [password, setPassword] = useState(initialRole === 'admin' ? envAdminPassword : envManagerPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Synchronize when role changes or URL param changes
  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'manager' || r === 'admin') {
      setRole(r);
      if (r === 'admin') {
        setEmail(envAdminEmail);
        setPassword(envAdminPassword);
      } else {
        setEmail(envManagerEmail);
        setPassword(envManagerPassword);
      }
    }
  }, [searchParams]);

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setSearchParams({ role: newRole });
    if (newRole === 'admin') {
      setEmail(envAdminEmail);
      setPassword(envAdminPassword);
    } else {
      setEmail(envManagerEmail);
      setPassword(envManagerPassword);
    }
  };

  const handleFillEnvCredentials = () => {
    if (role === 'admin') {
      setEmail(envAdminEmail);
      setPassword(envAdminPassword);
      toast.success('Admin credentials loaded from .env');
    } else {
      setEmail(envManagerEmail);
      setPassword(envManagerPassword);
      toast.success('Manager credentials loaded from .env');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      const userRole = result?.role || result?.user?.role;
      toast.success(`Signed in as ${result?.name || userRole}`);
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else if (userRole === 'manager') {
        navigate('/manager', { replace: true });
      } else {
        navigate(role === 'admin' ? '/admin' : '/manager', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body min-h-screen flex bg-slate-900 text-slate-100 selection:bg-primary-500 selection:text-white">
      {/* Left Side - Visual Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 items-center justify-center p-12 border-r border-white/10">
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 max-w-lg text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <img src="/logo.jpeg" alt="Aethrivo" className="h-14 w-auto rounded-xl shadow-lg shadow-black/50 group-hover:scale-105 transition-transform" />
            <span className="font-heading text-3xl font-black tracking-tight text-white">Aethrivo</span>
          </Link>
          <p className="text-xl font-heading font-semibold text-primary-300 tracking-widest mb-4">
            CONNECT. LEARN. INNOVATE. GROW.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Institutional administration portal. Manage member approvals, service pipelines, curriculum deployments, and cross-organizational MoUs.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className={`p-3 rounded-xl border transition-all ${role === 'admin' ? 'bg-primary-600/20 border-primary-500' : 'border-transparent'}`}>
              <Shield className="w-5 h-5 text-primary-400 mb-1" />
              <p className="text-xs font-bold text-white">Admin Portal</p>
              <p className="text-[11px] text-slate-400">Full system control, courses, MoUs & audit logs.</p>
            </div>
            <div className={`p-3 rounded-xl border transition-all ${role === 'manager' ? 'bg-violet-600/20 border-violet-500' : 'border-transparent'}`}>
              <UserCheck className="w-5 h-5 text-violet-400 mb-1" />
              <p className="text-xs font-bold text-white">Manager Portal</p>
              <p className="text-[11px] text-slate-400">Assigned inquiries, backlog tasks & directory.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Dedicated Portal Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          {/* Role Tabs Switcher */}
          <div className="flex p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-8">
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('manager')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'manager'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Manager Portal
            </button>
          </div>

          {/* Card Header */}
          <div className="mb-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
              {role === 'admin' ? 'Administrator Sign In' : 'Operations Manager Sign In'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
              {role === 'admin'
                ? 'Enter your master administrator credentials to access the console.'
                : 'Enter your manager credentials to access your task backlog.'}
            </p>
          </div>

          {/* Credentials Info Badge from .env */}
          <div className="mb-6 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">Stored in <code className="text-cyan-300 font-mono">.env</code></span>
            </div>
            <button
              type="button"
              onClick={handleFillEnvCredentials}
              className="text-xs font-semibold text-primary-400 hover:text-primary-300 underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Auto-fill
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {role === 'admin' ? 'Admin Email Address' : 'Manager Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@aethrivo.com' : 'manager@aethrivo.com'}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 text-sm mt-6 ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 shadow-primary-600/30'
                  : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/30'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In as {role === 'admin' ? 'Administrator' : 'Operations Manager'}
                </>
              )}
            </button>
          </form>

          {/* Footer Assistance */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            Need public access?{' '}
            <Link to="/membership" className="text-primary-400 hover:underline font-semibold">
              Register as Member
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
