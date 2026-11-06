import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Plus, Calendar, Edit3, Trash2, X, Search } from 'lucide-react';

const TYPE_OPTIONS = ['Conference', 'Workshop', 'Seminar', 'Webinar', 'Hackathon', 'Competition'];

const TYPE_COLORS = {
  Conference: 'bg-primary-100 text-primary-700',
  Workshop: 'bg-amber-100 text-amber-700',
  Seminar: 'bg-violet-100 text-violet-700',
  Webinar: 'bg-cyan-100 text-cyan-700',
  Hackathon: 'bg-green-100 text-green-700',
  Competition: 'bg-pink-100 text-pink-700',
};

const INITIAL_FORM = {
  title: '', description: '', type: 'Conference', startDate: '', endDate: '',
  venue: '', registrationDeadline: '', maxParticipants: '', fee: '',
};

export default function AdminEvents() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const res = await api.get('/admin/events');
      return res.data.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editingId
        ? api.put(`/admin/events/${editingId}`, payload)
        : api.post('/admin/events', payload),
    onSuccess: () => {
      toast.success(editingId ? 'Event updated' : 'Event created');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save event'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/events/${id}`),
    onSuccess: () => {
      toast.success('Event deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const events = data || [];
  const filtered = events.filter((e) =>
    !search || e.title?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  };

  const openEdit = (ev, event) => {
    ev.stopPropagation();
    setEditingId(event._id);
    setForm({
      title: event.title || '',
      description: event.description || '',
      type: event.type || 'Conference',
      startDate: event.startDate ? event.startDate.slice(0, 10) : '',
      endDate: event.endDate ? event.endDate.slice(0, 10) : '',
      venue: event.venue || '',
      registrationDeadline: event.registrationDeadline ? event.registrationDeadline.slice(0, 10) : '',
      maxParticipants: event.maxParticipants || '',
      fee: event.fee || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(INITIAL_FORM);
  };

  const handleDelete = (ev, id) => {
    ev.stopPropagation();
    if (window.confirm('Delete this event?')) {
      deleteMutation.mutate(id);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} event(s)</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="card-glass p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 w-full" />
        </div>
      </div>

      <div className="card-glass overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No events found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-left text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Start Date</th>
                  <th className="px-5 py-3">End Date</th>
                  <th className="px-5 py-3">Venue</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((ev) => (
                  <tr key={ev._id} className="hover:bg-primary-50/40 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{ev.title}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[ev.type] || 'bg-gray-100 text-gray-600'}`}>
                        {ev.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{ev.startDate ? new Date(ev.startDate).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{ev.endDate ? new Date(ev.endDate).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{ev.venue || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => openEdit(e, ev)} className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDelete(e, ev._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8">
          <div className="card-glass w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Event' : 'Add Event'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={updateField('title')} className="input-field w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={updateField('description')} className="input-field w-full" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={updateField('type')} className="input-field w-full">
                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input type="text" value={form.venue} onChange={updateField('venue')} className="input-field w-full" />
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
                  <input type="date" value={form.registrationDeadline} onChange={updateField('registrationDeadline')} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                  <input type="number" value={form.maxParticipants} onChange={updateField('maxParticipants')} className="input-field w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee</label>
                <input type="number" value={form.fee} onChange={updateField('fee')} className="input-field w-full" placeholder="0" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex-1">
                  {saveMutation.isPending ? 'Saving...' : (editingId ? 'Update Event' : 'Create Event')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
