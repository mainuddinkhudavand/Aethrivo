import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, Phone, Building, MessageSquare, Send, User } from 'lucide-react';

const STAGE_OPTIONS = ['New', 'Contacted', 'In Progress', 'Quoted', 'Completed', 'Closed'];

const STAGE_COLORS = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-violet-100 text-violet-700',
  Quoted: 'bg-cyan-100 text-cyan-700',
  Completed: 'bg-green-100 text-green-700',
  Closed: 'bg-slate-100 text-slate-700',
};

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState('');
  const [assignTo, setAssignTo] = useState('');

  const { data: enquiry, isLoading, error } = useQuery({
    queryKey: ['admin-enquiry', id],
    queryFn: async () => {
      const res = await api.get(`/enquiries/${id}`);
      return res.data.data;
    },
  });

  const stageMutation = useMutation({
    mutationFn: (stage) => api.patch(`/enquiries/${id}/stage`, { stage }),
    onSuccess: () => {
      toast.success('Stage updated');
      queryClient.invalidateQueries({ queryKey: ['admin-enquiry', id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update stage'),
  });

  const assignMutation = useMutation({
    mutationFn: (assignedTo) => api.patch(`/enquiries/${id}/assign`, { assignedTo }),
    onSuccess: () => {
      toast.success('Enquiry assigned');
      setAssignTo('');
      queryClient.invalidateQueries({ queryKey: ['admin-enquiry', id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to assign'),
  });

  const noteMutation = useMutation({
    mutationFn: (text) => api.post(`/enquiries/${id}/notes`, { text }),
    onSuccess: () => {
      toast.success('Note added');
      setNoteText('');
      queryClient.invalidateQueries({ queryKey: ['admin-enquiry', id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add note'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load enquiry.</p>
        <button onClick={() => navigate('/admin/enquiries')} className="btn-primary mt-4">Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => navigate('/admin/enquiries')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Enquiries
      </button>

      {/* Header */}
      <div className="card-glass p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{enquiry.name || enquiry.contactName || 'Client Enquiry'}</h1>
            <p className="text-sm text-gray-500">
              {typeof enquiry.vertical === 'object' && enquiry.vertical !== null
                ? enquiry.vertical.name || enquiry.vertical.slug || 'General'
                : enquiry.verticalTitle || enquiry.vertical || enquiry.verticalSlug || 'General'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${STAGE_COLORS[enquiry.stage || enquiry.currentStage] || 'bg-gray-100 text-gray-600'}`}>
            {enquiry.stage || enquiry.currentStage || 'New'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" /> {enquiry.email || enquiry.contactEmail || '—'}
          </div>
          {(enquiry.phone || enquiry.contactPhone) && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" /> {enquiry.phone || enquiry.contactPhone}
            </div>
          )}
          {enquiry.organisation && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4 text-gray-400" /> {enquiry.organisation}
            </div>
          )}
          {enquiry.assignedTo && (
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 text-gray-400" /> Assigned: {enquiry.assignedTo?.name || enquiry.assignedTo?.email || (typeof enquiry.assignedTo === 'string' ? enquiry.assignedTo : 'Unassigned')}
            </div>
          )}
        </div>

        {(enquiry.message || enquiry.formData?.message || enquiry.formData?.requirement) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Message / Scope</p>
            {enquiry.message || enquiry.formData?.message || enquiry.formData?.requirement}
          </div>
        )}
      </div>

      {/* Stage Update & Assign */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Update Stage</h3>
          <select
            value={enquiry.stage}
            onChange={(e) => stageMutation.mutate(e.target.value)}
            disabled={stageMutation.isPending}
            className="input-field w-full"
          >
            {STAGE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="card-glass p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Assign To</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="User ID or email"
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="input-field flex-1"
            />
            <button
              onClick={() => assignTo.trim() && assignMutation.mutate(assignTo.trim())}
              disabled={assignMutation.isPending || !assignTo.trim()}
              className="btn-primary px-4"
            >
              Assign
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card-glass p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Notes
        </h3>

        {/* Existing notes */}
        <div className="space-y-3 mb-6">
          {(enquiry.notes && enquiry.notes.length > 0) ? (
            enquiry.notes.map((note, idx) => (
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

        {/* Add note */}
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
    </div>
  );
}
