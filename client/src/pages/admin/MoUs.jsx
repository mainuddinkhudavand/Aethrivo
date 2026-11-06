import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Plus, FileText, Edit3, X, Search } from 'lucide-react';

const STATUS_OPTIONS = [
  'Lead', 'Discussion', 'Drafting', 'Legal/Institutional Review',
  'Approved', 'Signed', 'Active', 'Under Review', 'Renewed', 'Expired', 'Terminated'
];

const CONFIDENTIALITY_OPTIONS = ['Public', 'Confidential', 'Restricted'];

const INITIAL_FORM = {
  title: '',
  organisationName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  scope: '',
  status: 'Lead',
  partnerType: '',
  collaborationAreas: '',
  expectedOutcomes: '',
  geography: '',
  duration: '',
  financialExpectations: '',
  confidentiality: 'Confidential',
  startDate: '',
  endDate: '',
};

export default function AdminMoUs() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-mous'],
    queryFn: async () => {
      const res = await api.get('/admin/mous');
      return res.data.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => {
      const formatted = {
        ...payload,
        collaborationAreas: typeof payload.collaborationAreas === 'string'
          ? payload.collaborationAreas.split(',').map((s) => s.trim()).filter(Boolean)
          : payload.collaborationAreas,
      };
      return editingId
        ? api.put(`/admin/mous/${editingId}`, formatted)
        : api.post('/admin/mous', formatted);
    },
    onSuccess: () => {
      toast.success(editingId ? 'MoU updated' : 'MoU created');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['admin-mous'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save MoU'),
  });

  const mous = data || [];
  const filtered = mous.filter((m) =>
    !search ||
    m.title?.toLowerCase().includes(search.toLowerCase()) ||
    m.organisationName?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditingId(m._id);
    setForm({
      title: m.title || '',
      organisationName: m.organisationName || '',
      contactName: m.contactName || '',
      contactEmail: m.contactEmail || '',
      contactPhone: m.contactPhone || '',
      scope: m.scope || '',
      status: m.status || 'Lead',
      partnerType: m.partnerType || '',
      collaborationAreas: (m.collaborationAreas || []).join(', '),
      expectedOutcomes: m.expectedOutcomes || '',
      geography: m.geography || '',
      duration: m.duration || '',
      financialExpectations: m.financialExpectations || '',
      confidentiality: m.confidentiality || 'Confidential',
      startDate: m.startDate ? m.startDate.slice(0, 10) : '',
      endDate: m.endDate ? m.endDate.slice(0, 10) : '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(INITIAL_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    saveMutation.mutate(form);
  };

  const updateField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MoUs & Partnerships</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} MoU(s) tracked</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create MoU
        </button>
      </div>

      <div className="card-glass p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or organisation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
      </div>

      <div className="card-glass overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No MoUs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-left text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Organisation</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Partner Type</th>
                  <th className="px-5 py-3">Start Date</th>
                  <th className="px-5 py-3">End Date</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((m) => (
                  <tr key={m._id} className="hover:bg-primary-50/40 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{m.title}</td>
                    <td className="px-5 py-3 text-gray-600">{m.organisationName || '—'}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{m.partnerType || '—'}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {m.startDate ? new Date(m.startDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {m.endDate ? new Date(m.endDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openEdit(m)}
                        className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8">
          <div className="card-glass w-full max-w-2xl mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit MoU' : 'Create MoU'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={updateField('title')} className="input-field w-full" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organisation Name</label>
                  <input type="text" value={form.organisationName} onChange={updateField('organisationName')} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner Type</label>
                  <input type="text" value={form.partnerType} onChange={updateField('partnerType')} placeholder="e.g. University, Industry" className="input-field w-full" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <input type="text" value={form.contactName} onChange={updateField('contactName')} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input type="email" value={form.contactEmail} onChange={updateField('contactEmail')} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input type="text" value={form.contactPhone} onChange={updateField('contactPhone')} className="input-field w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={updateField('status')} className="input-field w-full">
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confidentiality</label>
                  <select value={form.confidentiality} onChange={updateField('confidentiality')} className="input-field w-full">
                    {CONFIDENTIALITY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scope & Purpose</label>
                <textarea value={form.scope} onChange={updateField('scope')} className="input-field w-full" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collaboration Areas (comma separated)</label>
                <input type="text" value={form.collaborationAreas} onChange={updateField('collaborationAreas')} placeholder="Research, Internships, Training" className="input-field w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={updateField('startDate')} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={updateField('endDate')} className="input-field w-full" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex-1">
                  {saveMutation.isPending ? 'Saving...' : (editingId ? 'Update MoU' : 'Create MoU')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
