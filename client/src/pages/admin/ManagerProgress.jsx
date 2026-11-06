import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { UserCheck, Key, Clock, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export default function AdminManagerProgress() {
  const [newPassword, setNewPassword] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-manager-progress'],
    queryFn: async () => {
      const res = await api.get('/admin/manager-progress');
      return res.data.data;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (pwd) => api.put('/admin/reset-manager-password', { newPassword: pwd }),
    onSuccess: () => {
      toast.success('Manager password reset successfully');
      setShowResetModal(false);
      setNewPassword('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to reset password'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const manager = data?.manager;
  const assignedEnquiries = data?.assignedEnquiries ?? 0;
  const completedEnquiries = data?.completedEnquiries ?? 0;
  const assignedTasks = data?.assignedTasks ?? 0;
  const completedTasks = data?.completedTasks ?? 0;
  const recentActivity = data?.recentActivity || [];

  const enquiryRate = assignedEnquiries > 0 ? Math.round((completedEnquiries / assignedEnquiries) * 100) : 0;
  const taskRate = assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Monitoring & Progress</h1>
          <p className="text-gray-500 text-sm mt-1">Track manager productivity and task completion rates</p>
        </div>
        <button onClick={() => setShowResetModal(true)} className="btn-secondary flex items-center gap-2">
          <Key className="w-4 h-4" /> Reset Manager Password
        </button>
      </div>

      {/* Manager Profile Card */}
      <div className="card-glass p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
            <UserCheck className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{manager?.name || 'Assigned Manager'}</h2>
            <p className="text-sm text-gray-500">{manager?.email}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Last active: {manager?.lastLogin ? new Date(manager.lastLogin).toLocaleString() : 'Never logged in'}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enquiries Card */}
        <div className="card-glass p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Enquiries Pipeline</h3>
          <p className="text-sm text-gray-500 mb-4">{completedEnquiries} of {assignedEnquiries} enquiries resolved</p>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-3">
            <div
              className="bg-primary-600 h-full transition-all duration-500"
              style={{ width: `${enquiryRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Completion Rate</span>
            <span className="font-bold text-gray-800">{enquiryRate}%</span>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="card-glass p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Tasks Completed</h3>
          <p className="text-sm text-gray-500 mb-4">{completedTasks} of {assignedTasks} tasks finished</p>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-3">
            <div
              className="bg-emerald-600 h-full transition-all duration-500"
              style={{ width: `${taskRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Completion Rate</span>
            <span className="font-bold text-gray-800">{taskRate}%</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" /> Recent Manager Activity
        </h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No recent activity logged</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((log) => (
              <div key={log._id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-gray-800">{log.action}</span>
                  <span className="text-gray-500 ml-2">on {log.entity}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="card-glass w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reset Manager Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter a temporary password for the manager. They will be required to change it on next login.
            </p>
            <input
              type="password"
              placeholder="Enter new temporary password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field w-full mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowResetModal(false)} className="btn-outline flex-1">
                Cancel
              </button>
              <button
                onClick={() => newPassword.trim() && resetPasswordMutation.mutate(newPassword.trim())}
                disabled={resetPasswordMutation.isPending || !newPassword.trim()}
                className="btn-primary flex-1"
              >
                {resetPasswordMutation.isPending ? 'Resetting...' : 'Set Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
