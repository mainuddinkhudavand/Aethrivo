import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { KeyRound, User } from 'lucide-react';

export default function ManagerSettings() {
  const { user, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manager Account Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage credentials and profile</p>
      </div>

      <div className="card-glass p-6">
        <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" /> Account Details
        </h2>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">
            <span className="text-gray-400 text-xs uppercase tracking-wider block">Name:</span>
            {user?.name || 'Manager'}
          </p>
          <p className="text-gray-700">
            <span className="text-gray-400 text-xs uppercase tracking-wider block">Email:</span>
            {user?.email}
          </p>
          <p className="text-gray-700">
            <span className="text-gray-400 text-xs uppercase tracking-wider block">Role:</span>
            <span className="uppercase text-xs font-semibold text-primary-600">{user?.role}</span>
          </p>
        </div>
      </div>

      <div className="card-glass p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary-600" /> Update Password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
