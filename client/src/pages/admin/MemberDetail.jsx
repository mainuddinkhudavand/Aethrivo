import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

const STATUS_OPTIONS = ['Submitted', 'Under Review', 'Active', 'Suspended', 'Rejected'];

const STATUS_COLORS = {
  Active: 'bg-green-100 text-green-700',
  Submitted: 'bg-amber-100 text-amber-700',
  'Under Review': 'bg-blue-100 text-blue-700',
  Suspended: 'bg-red-100 text-red-700',
  Rejected: 'bg-red-100 text-red-700',
};

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: member, isLoading, error } = useQuery({
    queryKey: ['admin-member', id],
    queryFn: async () => {
      const res = await api.get(`/members/${id}`);
      return res.data.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status) => api.patch(`/members/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-member', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status'),
  });

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus && window.confirm(`Change status to "${newStatus}"?`)) {
      statusMutation.mutate(newStatus);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load member details.</p>
        <button onClick={() => navigate('/admin/members')} className="btn-primary mt-4">
          Back to Members
        </button>
      </div>
    );
  }

  const standardFields = new Set([
    '_id', '__v', 'name', 'email', 'phone', 'category', 'status', 'memberId',
    'address', 'city', 'state', 'country', 'createdAt', 'updatedAt', 'password',
    'pincode', 'role', 'documents', 'profilePhoto',
  ]);
  const extraFields = Object.entries(member).filter(
    ([key, val]) => !standardFields.has(key) && val !== null && val !== undefined && val !== ''
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => navigate('/admin/members')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Members
      </button>

      <div className="card-glass p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{member.name}</h1>
            <p className="text-sm text-gray-500">{member.memberId || 'No ID'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[member.status] || 'bg-gray-100 text-gray-600'}`}>
            {member.status}
          </span>
          <select
            value=""
            onChange={handleStatusChange}
            disabled={statusMutation.isPending}
            className="input-field text-sm py-1.5"
          >
            <option value="">Change Status</option>
            {STATUS_OPTIONS.filter((s) => s !== member.status).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Contact Info</h3>
          <InfoRow icon={Mail} label="Email" value={member.email} />
          <InfoRow icon={Phone} label="Phone" value={member.phone} />
          <InfoRow icon={MapPin} label="Address" value={member.address} />
          <InfoRow icon={MapPin} label="City" value={member.city} />
          <InfoRow icon={MapPin} label="State" value={member.state} />
          <InfoRow icon={MapPin} label="Country" value={member.country} />
          {member.pincode && <InfoRow icon={MapPin} label="Pincode" value={member.pincode} />}
        </div>

        <div className="card-glass p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Membership</h3>
          <InfoRow icon={Shield} label="Category" value={member.category} />
          <InfoRow icon={Shield} label="Status" value={member.status} />
          <InfoRow icon={Calendar} label="Created" value={member.createdAt ? new Date(member.createdAt).toLocaleString() : '—'} />
          <InfoRow icon={Calendar} label="Updated" value={member.updatedAt ? new Date(member.updatedAt).toLocaleString() : '—'} />
        </div>
      </div>

      {extraFields.length > 0 && (
        <div className="card-glass p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {extraFields.map(([key, val]) => (
              <InfoRow
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                value={typeof val === 'object' ? JSON.stringify(val) : String(val)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
