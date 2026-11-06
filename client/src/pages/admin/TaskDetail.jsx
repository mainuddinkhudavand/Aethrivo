import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit3, Send, MessageSquare, Clock, AlertTriangle, X } from 'lucide-react';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'];
const STATUS_OPTIONS = ['Open', 'In Progress', 'Completed', 'Cancelled'];

const PRIORITY_COLORS = {
  Low: 'bg-slate-100 text-slate-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-red-700',
};

const STATUS_COLORS = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-violet-100 text-violet-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-slate-100 text-slate-700',
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const { data: task, isLoading, error } = useQuery({
    queryKey: ['admin-task', id],
    queryFn: async () => {
      const res = await api.get(`/tasks/${id}`);
      return res.data.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.put(`/tasks/${id}`, data),
    onSuccess: () => {
      toast.success('Task updated');
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ['admin-task', id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const noteMutation = useMutation({
    mutationFn: (text) => api.post(`/tasks/${id}/notes`, { text }),
    onSuccess: () => {
      toast.success('Note added');
      setNoteText('');
      queryClient.invalidateQueries({ queryKey: ['admin-task', id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add note'),
  });

  const startEdit = () => {
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'Medium',
      status: task.status || 'Open',
      assignedTo: task.assignedTo?._id || task.assignedTo || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
    setEditing(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(editForm);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load task.</p>
        <button onClick={() => navigate('/admin/tasks')} className="btn-primary mt-4">Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => navigate('/admin/tasks')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tasks
      </button>

      {/* Task Info */}
      <div className="card-glass p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
            {task.description && <p className="text-gray-600 text-sm mt-2">{task.description}</p>}
          </div>
          <button onClick={startEdit} className="btn-outline flex items-center gap-2 text-sm shrink-0">
            <Edit3 className="w-4 h-4" /> Edit
          </button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-gray-400" />
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority] || ''}`}>
              {task.priority}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[task.status] || ''}`}>
              {task.status}
            </span>
          </div>
          {task.assignedTo && (
            <div className="text-gray-600">
              Assigned: {task.assignedTo?.name || task.assignedTo}
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="card-glass p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Notes
        </h3>

        <div className="space-y-3 mb-6">
          {(task.notes && task.notes.length > 0) ? (
            task.notes.map((note, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-800">{note.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {note.author?.name || note.author || 'Unknown'} · {note.createdAt ? new Date(note.createdAt).toLocaleString() : ''}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No notes yet.</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && noteText.trim() && noteMutation.mutate(noteText.trim())}
            className="input-field flex-1"
          />
          <button
            onClick={() => noteText.trim() && noteMutation.mutate(noteText.trim())}
            disabled={noteMutation.isPending || !noteText.trim()}
            className="btn-primary px-4"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="card-glass w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Edit Task</h2>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="input-field w-full"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="input-field w-full"
                  >
                    {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="input-field w-full"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <input
                    type="text"
                    value={editForm.assignedTo}
                    onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={updateMutation.isPending} className="btn-primary flex-1">
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
