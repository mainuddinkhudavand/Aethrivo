import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  Award, CheckCircle, XCircle, Search, Filter, X, Edit3, Trash2,
  Plus, Check, Globe, Eye, EyeOff, Loader2, UserCheck
} from 'lucide-react';

const STATUS_COLORS = {
  Verified: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
};

export default function AdminExperts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Status Modal State
  const [statusModalExpert, setStatusModalExpert] = useState(null);
  const [newStatus, setNewStatus] = useState('Verified');
  const [note, setNote] = useState('');

  // Edit Modal State
  const [editModalExpert, setEditModalExpert] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    expertiseTags: '',
    languages: '',
    qualifications: '',
    trainingTopics: '',
    mode: 'Both',
    feeExpectation: '',
    availability: '',
    directoryOptIn: true,
    verificationStatus: 'Verified',
    bio: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-experts', statusFilter],
    queryFn: async () => {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await api.get('/admin/experts', { params });
      return res.data.data;
    },
  });

  // Status Update Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, note }) =>
      api.patch(`/admin/experts/${id}/status`, { status, note }),
    onSuccess: () => {
      toast.success('Expert status updated successfully');
      setStatusModalExpert(null);
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      queryClient.invalidateQueries({ queryKey: ['public-experts'] });
    },
    onError: (err) => toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to update status'),
  });

  // Edit Expert Details Mutation
  const updateExpertMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/admin/experts/${id}`, payload),
    onSuccess: () => {
      toast.success('Expert details saved successfully');
      setEditModalExpert(null);
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      queryClient.invalidateQueries({ queryKey: ['public-experts'] });
    },
    onError: (err) => toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to update expert'),
  });

  // Delete Expert Mutation
  const deleteExpertMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/experts/${id}`),
    onSuccess: () => {
      toast.success('Expert removed successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      queryClient.invalidateQueries({ queryKey: ['public-experts'] });
    },
    onError: (err) => toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to delete expert'),
  });

  const experts = (data || []).map((e) => ({
    ...e,
    displayName: e.fullName || e.name || 'Specialist',
    tags: e.expertiseTags && e.expertiseTags.length > 0 ? e.expertiseTags : (e.domains || []),
    langs: e.languages || [],
  }));

  const filtered = experts.filter((exp) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      exp.displayName.toLowerCase().includes(q) ||
      (exp.email && exp.email.toLowerCase().includes(q)) ||
      (exp.bio && exp.bio.toLowerCase().includes(q)) ||
      exp.tags.some((d) => d.toLowerCase().includes(q));
    return matchSearch;
  });

  const openStatusModal = (expert) => {
    setStatusModalExpert(expert);
    setNewStatus(expert.verificationStatus === 'Verified' ? 'Pending' : 'Verified');
    setNote('');
  };

  const openEditModal = (expert) => {
    setEditModalExpert(expert);
    setEditForm({
      fullName: expert.fullName || expert.name || '',
      email: expert.email || '',
      phone: expert.phone || '',
      experience: expert.experience || '',
      expertiseTags: Array.isArray(expert.tags) ? expert.tags.join(', ') : '',
      languages: Array.isArray(expert.langs) ? expert.langs.join(', ') : '',
      qualifications: Array.isArray(expert.qualifications) ? expert.qualifications.join(', ') : '',
      trainingTopics: Array.isArray(expert.trainingTopics) ? expert.trainingTopics.join(', ') : '',
      mode: expert.mode || 'Both',
      feeExpectation: expert.feeExpectation || '',
      availability: expert.availability || '',
      directoryOptIn: expert.directoryOptIn !== false,
      verificationStatus: expert.verificationStatus || 'Verified',
      bio: expert.bio || '',
    });
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (!statusModalExpert) return;
    updateStatusMutation.mutate({
      id: statusModalExpert._id,
      status: newStatus,
      note: note.trim() || undefined,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editModalExpert) return;
    updateExpertMutation.mutate({
      id: editModalExpert._id,
      payload: {
        ...editForm,
        expertiseTags: editForm.expertiseTags,
        languages: editForm.languages,
        qualifications: editForm.qualifications,
        trainingTopics: editForm.trainingTopics,
      },
    });
  };

  const handleDelete = (expert) => {
    if (window.confirm(`Are you sure you want to remove expert "${expert.displayName}"?`)) {
      deleteExpertMutation.mutate(expert._id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Experts Management</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} expert(s) in database</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card-glass p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or domain tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-full text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-glass overflow-hidden rounded-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-base font-medium">No experts found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3.5">Expert / Contact</th>
                  <th className="px-5 py-3.5">Expertise Tags</th>
                  <th className="px-5 py-3.5">Experience & Mode</th>
                  <th className="px-5 py-3.5">Directory Opt-In</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((exp) => (
                  <tr key={exp._id} className="hover:bg-primary-50/40 dark:hover:bg-primary-950/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{exp.displayName}</div>
                      <div className="text-xs text-gray-500">{exp.email}</div>
                      {exp.phone && <div className="text-xs text-gray-400">{exp.phone}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {exp.tags.slice(0, 3).map((d, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {d}
                          </span>
                        ))}
                        {exp.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{exp.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">{exp.experience || 'Not specified'}</div>
                      <div className="text-xs text-primary-600 flex items-center gap-1 mt-0.5">
                        <Globe className="w-3 h-3" /> {exp.mode || 'Both'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {exp.directoryOptIn !== false ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400 font-medium">
                          <Eye className="w-3.5 h-3.5" /> Listed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <EyeOff className="w-3.5 h-3.5" /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[exp.verificationStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {exp.verificationStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="btn-outline text-xs px-2.5 py-1.5 flex items-center gap-1 text-primary-600 hover:text-primary-700"
                          title="Edit Expert"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => openStatusModal(exp)}
                          className="btn-outline text-xs px-2.5 py-1.5 flex items-center gap-1 text-gray-600 hover:text-gray-900"
                          title="Change Verification Status"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Status
                        </button>
                        <button
                          onClick={() => handleDelete(exp)}
                          className="btn-outline text-xs px-2 py-1.5 text-red-500 hover:text-red-700 hover:border-red-300"
                          title="Delete Expert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT EXPERT MODAL */}
      {editModalExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="card-glass w-full max-w-2xl p-6 rounded-2xl shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Expert Details</h2>
                <p className="text-xs text-gray-500">ID: {editModalExpert._id} • Member ID: {editModalExpert.memberId || 'N/A'}</p>
              </div>
              <button onClick={() => setEditModalExpert(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 15+ Years in Patent Prosecution"
                    value={editForm.experience}
                    onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Expertise Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Patent Drafting, AI, Bio-Medical, FTO"
                  value={editForm.expertiseTags}
                  onChange={(e) => setEditForm({ ...editForm, expertiseTags: e.target.value })}
                  className="input-field w-full text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Languages (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="English, Hindi, German"
                    value={editForm.languages}
                    onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Qualifications (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Ph.D. in Computer Science, LL.B."
                    value={editForm.qualifications}
                    onChange={(e) => setEditForm({ ...editForm, qualifications: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Engagement Mode</label>
                  <select
                    value={editForm.mode}
                    onChange={(e) => setEditForm({ ...editForm, mode: e.target.value })}
                    className="input-field w-full text-sm"
                  >
                    <option value="Both">Both (Online & Offline)</option>
                    <option value="Online">Online Only</option>
                    <option value="Offline">Offline Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Fee Expectation</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹15,000 / Session"
                    value={editForm.feeExpectation}
                    onChange={(e) => setEditForm({ ...editForm, feeExpectation: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Availability</label>
                  <input
                    type="text"
                    placeholder="e.g. Weekends / On-Demand"
                    value={editForm.availability}
                    onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Verification Status</label>
                  <select
                    value={editForm.verificationStatus}
                    onChange={(e) => setEditForm({ ...editForm, verificationStatus: e.target.value })}
                    className="input-field w-full text-sm"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="dirOptIn"
                    checked={editForm.directoryOptIn}
                    onChange={(e) => setEditForm({ ...editForm, directoryOptIn: e.target.checked })}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="dirOptIn" className="text-xs font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">
                    Display in Public Directory
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Professional Bio</label>
                <textarea
                  rows={4}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Comprehensive profile overview, notable cases, technology sectors..."
                  className="input-field w-full text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditModalExpert(null)}
                  className="btn-outline flex-1 text-sm py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateExpertMutation.isPending}
                  className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-2 font-semibold"
                >
                  {updateExpertMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {updateExpertMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATUS UPDATE MODAL */}
      {statusModalExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="card-glass w-full max-w-md p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Update Status</h2>
              <button onClick={() => setStatusModalExpert(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Updating status for <span className="font-semibold text-gray-900 dark:text-white">{statusModalExpert.displayName}</span>
            </p>
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input-field w-full text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Verification Note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional review note or feedback..."
                  className="input-field w-full text-sm"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStatusModalExpert(null)} className="btn-outline flex-1 text-sm py-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateStatusMutation.isPending}
                  className="btn-primary flex-1 text-sm py-2 font-semibold"
                >
                  {updateStatusMutation.isPending ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
