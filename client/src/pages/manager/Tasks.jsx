import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { CheckSquare, Search, Send, Clock, AlertTriangle, X } from 'lucide-react';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Completed', 'Cancelled'];

const STATUS_COLORS = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-violet-100 text-violet-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-slate-100 text-slate-700',
};

const PRIORITY_COLORS = {
  Low: 'bg-slate-100 text-slate-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-red-700',
};

export default function ManagerTasks() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [noteText, setNoteText] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['manager-tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/tasks/${id}`, { status }),
    onSuccess: (res) => {
      toast.success('Task status updated');
      queryClient.invalidateQueries({ queryKey: ['manager-tasks'] });
      if (selectedTask && res?.data?.data) {
        setSelectedTask(res.data.data);
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status'),
  });

  const noteMutation = useMutation({
    mutationFn: ({ id, text }) => api.post(`/tasks/${id}/notes`, { text }),
    onSuccess: (res) => {
      toast.success('Note added');
      setNoteText('');
      queryClient.invalidateQueries({ queryKey: ['manager-tasks'] });
      if (selectedTask && res?.data?.data) {
        setSelectedTask(res.data.data);
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add note'),
  });

  const tasks = data || [];
  const filtered = tasks.filter((t) =>
    !search || t.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Assignments</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} tasks in backlog</p>
        </div>
      </div>

      {/* Search */}
      <div className="card-glass p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-full"
          />
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
            <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tasks assigned.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-left text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => setSelectedTask(t)}
                    className="hover:bg-primary-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">{t.title}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[t.priority] || 'bg-gray-100 text-gray-600'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[t.status] || 'bg-gray-100 text-gray-600'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={t.status}
                        onChange={(e) => statusMutation.mutate({ id: t._id, status: e.target.value })}
                        className="input-field text-xs py-1 px-2"
                      >
                        {STATUS_OPTIONS.map((s) => (
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

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="card-glass w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{selectedTask.title}</h2>
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedTask.description && (
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl mb-4">
                {selectedTask.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-xs mb-6 text-gray-500">
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Priority: <span className="font-semibold text-gray-800">{selectedTask.priority}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-primary-500" />
                Due: <span className="font-semibold text-gray-800">{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'None'}</span>
              </div>
            </div>

            {/* Task Notes */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Work Log & Notes</h3>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {(selectedTask.notes && selectedTask.notes.length > 0) ? (
                  selectedTask.notes.map((n, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded text-xs">
                      <p className="text-gray-800">{n.text}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No notes attached.</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Record task progress note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="input-field text-xs flex-1"
                />
                <button
                  onClick={() => noteText.trim() && noteMutation.mutate({ id: selectedTask._id, text: noteText.trim() })}
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
