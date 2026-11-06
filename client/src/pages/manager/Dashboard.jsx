import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { MessageSquare, CheckSquare, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ManagerDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['manager-dashboard'],
    queryFn: async () => {
      const res = await api.get('/manager/dashboard');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const d = data || {};
  const recentEnquiries = d.recentEnquiries || [];
  const recentTasks = d.recentTasks || [];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          Manager Workspace, <span className="gradient-text">{user?.name || 'Operations'}</span>
        </h1>
        <p className="text-gray-500 mt-1">Review your active enquiries and task backlog.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-glass p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Open Enquiries</span>
            <div className="p-2.5 rounded-xl bg-violet-100 text-violet-700">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{d.openEnquiries ?? 0}</div>
          <p className="text-xs text-gray-400 mt-1">{d.completedEnquiries ?? 0} resolved of {d.assignedEnquiries ?? 0} total</p>
        </div>

        <div className="card-glass p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Pending Tasks</span>
            <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{d.openTasks ?? 0}</div>
          <p className="text-xs text-gray-400 mt-1">{d.completedTasks ?? 0} completed of {d.assignedTasks ?? 0} total</p>
        </div>

        <div className="card-glass p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Completed Deliverables</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {(d.completedEnquiries ?? 0) + (d.completedTasks ?? 0)}
          </div>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Active progress recorded</p>
        </div>
      </div>

      {/* Dual Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <div className="card-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-600" /> Assigned Enquiries
            </h2>
            <Link to="/manager/enquiries" className="text-xs text-primary-600 hover:underline flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No assigned enquiries.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentEnquiries.map((enq) => (
                <div key={enq._id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">{enq.name || enq.contactName || 'Client'}</p>
                    <p className="text-xs text-gray-500">
                      {typeof enq.vertical === 'object' && enq.vertical !== null
                        ? enq.vertical.name || enq.vertical.slug || 'Direct Enquiry'
                        : enq.verticalTitle || enq.vertical || 'Direct Enquiry'}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {enq.stage}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="card-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-cyan-600" /> Assigned Tasks
            </h2>
            <Link to="/manager/tasks" className="text-xs text-primary-600 hover:underline flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No assigned tasks.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTasks.map((t) => (
                <div key={t._id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">{t.title}</p>
                    <p className="text-xs text-gray-500">
                      Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No deadline'}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
