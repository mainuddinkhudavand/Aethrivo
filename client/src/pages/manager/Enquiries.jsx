import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Search, Filter, MessageSquare, Send, X, Mail, Phone, Building } from 'lucide-react';

const STAGE_OPTIONS = ['New', 'Contacted', 'In Progress', 'Quoted', 'Completed', 'Closed'];

const STAGE_COLORS = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-violet-100 text-violet-700',
  Quoted: 'bg-cyan-100 text-cyan-700',
  Completed: 'bg-green-100 text-green-700',
  Closed: 'bg-slate-100 text-slate-700',
};

export default function ManagerEnquiries() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [noteText, setNoteText] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['manager-enquiries'],
    queryFn: async () => {
      const res = await api.get('/enquiries');
      return res.data.data;
    },
  });

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }) => api.patch(`/enquiries/${id}/stage`, { stage }),
    onSuccess: (res) => {
      toast.success('Stage updated');
      queryClient.invalidateQueries({ queryKey: ['manager-enquiries'] });
      if (selectedEnquiry && res?.data?.data) {
        setSelectedEnquiry(res.data.data);
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update stage'),
  });

  const noteMutation = useMutation({
    mutationFn: ({ id, text }) => api.post(`/enquiries/${id}/notes`, { text }),
    onSuccess: (res) => {
      toast.success('Note added');
      setNoteText('');
      queryClient.invalidateQueries({ queryKey: ['manager-enquiries'] });
      if (selectedEnquiry && res?.data?.data) {
        setSelectedEnquiry(res.data.data);
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add note'),
  });

  const enquiries = (data || []).map((e) => ({
    ...e,
    displayName: e.name || e.contactName || e.formData?.name || 'Anonymous',
    displayEmail: e.email || e.contactEmail || e.formData?.email || '—',
    displayPhone: e.phone || e.contactPhone || e.formData?.phone || '',
    displayStage: e.stage || e.currentStage || e.status || 'New',
    displayVertical: typeof e.vertical === 'object' && e.vertical !== null ? e.vertical.name || e.vertical.slug || 'Direct' : e.verticalTitle || e.vertical || 'Direct',
    displayMessage: e.message || e.formData?.message || e.formData?.requirement || '',
  }));

  const filtered = enquiries.filter((e) => {
    const matchSearch =
      !search ||
      e.displayName.toLowerCase().includes(search.toLowerCase()) ||
      e.displayEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.displayVertical.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'All' || e.displayStage === stageFilter;
    return matchSearch && matchStage;
  });

  const handleStageChange = (e, enquiryId) => {
    const newStage = e.target.value;
    if (newStage) {
      stageMutation.mutate({ id: enquiryId, stage: newStage });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assigned Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} client inquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card-glass p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="input-field text-sm"
          >
            <option value="All">All Stages</option>
            {STAGE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-glass overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No enquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-left text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Vertical</th>
                  <th className="px-5 py-3">Stage</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((e) => (
                  <tr
                    key={e._id}
                    onClick={() => setSelectedEnquiry(e)}
                    className="hover:bg-primary-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{e.displayName}</div>
                      <div className="text-xs text-gray-500">{e.displayEmail}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{e.displayVertical}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STAGE_COLORS[e.displayStage] || 'bg-gray-100 text-gray-600'}`}>
                        {e.displayStage}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3" onClick={(ev) => ev.stopPropagation()}>
                      <select
                        value={e.displayStage}
                        onChange={(ev) => handleStageChange(ev, e._id)}
                        className="input-field text-xs py-1 px-2"
                      >
                        {STAGE_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Slide/Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="card-glass w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{selectedEnquiry.displayName || selectedEnquiry.name}</h2>
              <button onClick={() => setSelectedEnquiry(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" /> {selectedEnquiry.displayEmail || selectedEnquiry.email}
              </div>
              {(selectedEnquiry.displayPhone || selectedEnquiry.phone) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" /> {selectedEnquiry.displayPhone || selectedEnquiry.phone}
                </div>
              )}
              {selectedEnquiry.organisation && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="w-4 h-4 text-gray-400" /> {selectedEnquiry.organisation}
                </div>
              )}
              {(selectedEnquiry.displayMessage || selectedEnquiry.message) && (
                <div className="p-3 bg-gray-50 rounded-xl text-gray-700 text-xs mt-2">
                  <span className="font-semibold block text-gray-500 mb-1">Message:</span>
                  {selectedEnquiry.displayMessage || selectedEnquiry.message}
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Notes & Updates</h3>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {(selectedEnquiry.notes && selectedEnquiry.notes.length > 0) ? (
                  selectedEnquiry.notes.map((n, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded text-xs">
                      <p className="text-gray-800">{n.text}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No notes recorded yet.</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add status note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="input-field text-xs flex-1"
                />
                <button
                  onClick={() => noteText.trim() && noteMutation.mutate({ id: selectedEnquiry._id, text: noteText.trim() })}
                  disabled={noteMutation.isPending || !noteText.trim()}
                  className="btn-primary text-xs px-3"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
