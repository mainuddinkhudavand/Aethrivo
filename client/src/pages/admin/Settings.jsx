import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { KeyRound, ShieldAlert, User } from 'lucide-react';

export default function AdminSettings() {
  const { user, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [managerPwd, setManagerPwd] = useState('');
  const [managerLoading, setManagerLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Your password has been changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleManagerReset = async (e) => {
    e.preventDefault();
    if (!managerPwd || managerPwd.length < 6) {
      return toast.error('Temporary password must be at least 6 characters');
    }
    setManagerLoading(true);
    try {
      await api.put('/admin/reset-manager-password', { newPassword: managerPwd });
      toast.success('Manager password reset successfully');
      setManagerPwd('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset manager password');
    } finally {
      setManagerLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Account & Security Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your administrative credentials and access controls</p>
      </div>

      {/* Profile Summary */}
      <div className="card-glass p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" /> Account Profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 text-xs uppercase tracking-wider block">Name</span>
            <span className="font-semibold text-gray-900">{user?.name || 'Administrator'}</span>
          </div>
          <div>
            <span className="text-gray-500 text-xs uppercase tracking-wider block">Email</span>
            <span className="font-semibold text-gray-900">{user?.email}</span>
          </div>
          <div>
            <span className="text-gray-500 text-xs uppercase tracking-wider block">Role</span>
            <span className="font-semibold text-primary-600 uppercase text-xs">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="card-glass p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary-600" /> Change Your Password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Reset Manager Password */}
      <div className="card-glass p-6">
        <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2 text-amber-700">
          <ShieldAlert className="w-5 h-5 text-amber-600" /> Administrative Overrides
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Reset password for the operations manager account directly.
        </p>
        <form onSubmit={handleManagerReset} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="password"
            placeholder="New manager password"
            value={managerPwd}
            onChange={(e) => setManagerPwd(e.target.value)}
            className="input-field flex-1"
            required
          />
          <button type="submit" disabled={managerLoading} className="btn-secondary whitespace-nowrap">
            {managerLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
