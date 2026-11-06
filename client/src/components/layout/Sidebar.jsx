import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CheckSquare,
  BookOpen,
  Calendar,
  Award,
  FileText,
  BarChart3,
  Shield,
  Settings,
  X,
} from 'lucide-react';

const adminItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/experts', label: 'Experts', icon: Award },
  { to: '/admin/mous', label: 'MoUs', icon: FileText },
  { to: '/admin/manager-progress', label: 'Manager Progress', icon: BarChart3 },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: Shield },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const managerItems = [
  { to: '/manager', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/manager/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/manager/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/manager/members', label: 'Members', icon: Users },
  { to: '/manager/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ role = 'admin', isOpen, onClose }) {
  const items = role === 'admin' ? adminItems : managerItems;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 
          flex flex-col transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="Aethrivo" className="h-9 w-auto rounded-lg" />
            <span className="text-lg font-bold gradient-text tracking-wide font-heading">
              AETHRIVO
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              role === 'admin'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-accent-100 text-accent-700'
            }`}
          >
            {role}
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom branding */}
        <div className="px-5 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">&copy; 2026 Aethrivo</p>
        </div>
      </aside>
    </>
  );
}
