import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Plus, BookOpen, Edit3, Trash2, X, Search } from 'lucide-react';

const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];
const MODE_OPTIONS = ['Online', 'Offline', 'Hybrid'];

const INITIAL_FORM = {
  title: '', description: '', category: '', duration: '', level: 'Beginner',
  mode: 'Online', fee: '', syllabus: '', prerequisites: '', outcomes: '',
};

export default function AdminCourses() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const res = await api.get('/admin/courses');
      return res.data.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editingId
        ? api.put(`/admin/courses/${editingId}`, payload)
        : api.post('/admin/courses', payload),
    onSuccess: () => {
      toast.success(editingId ? 'Course updated' : 'Course created');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save course'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/courses/${id}`),
    onSuccess: () => {
      toast.success('Course deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const courses = data || [];
  const filtered = courses.filter((c) =>
    !search || c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  };

  const openEdit = (e, course) => {
    e.stopPropagation();
    setEditingId(course._id);
    setForm({
      title: course.title || '',
      description: course.description || '',
      category: course.category || '',
      duration: course.duration || '',
      level: course.level || 'Beginner',
      mode: course.mode || 'Online',
      fee: course.fee || '',
      syllabus: course.syllabus || '',
      prerequisites: course.prerequisites || '',
      outcomes: course.outcomes || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(INITIAL_FORM);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this course?')) {
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
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} course(s)</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="card-glass p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
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
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No courses found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-left text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Level</th>
                  <th className="px-5 py-3">Mode</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Fee</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-primary-50/40 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{c.title}</td>
                    <td className="px-5 py-3 text-gray-600">{c.category || '—'}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                        {c.level}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{c.mode}</td>
                    <td className="px-5 py-3 text-gray-600">{c.duration || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{c.fee ? `₹${c.fee}` : 'Free'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => openEdit(e, c)} className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDelete(e, c._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
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
          <div className="card-glass w-full max-w-2xl mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={form.category} onChange={updateField('category')} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input type="text" value={form.duration} onChange={updateField('duration')} className="input-field w-full" placeholder="e.g., 6 weeks" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select value={form.level} onChange={updateField('level')} className="input-field w-full">
                    {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <select value={form.mode} onChange={updateField('mode')} className="input-field w-full">
                    {MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee</label>
                  <input type="number" value={form.fee} onChange={updateField('fee')} className="input-field w-full" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
                <textarea value={form.syllabus} onChange={updateField('syllabus')} className="input-field w-full" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
                <textarea value={form.prerequisites} onChange={updateField('prerequisites')} className="input-field w-full" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcomes</label>
                <textarea value={form.outcomes} onChange={updateField('outcomes')} className="input-field w-full" rows={2} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex-1">
                  {saveMutation.isPending ? 'Saving...' : (editingId ? 'Update Course' : 'Create Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
