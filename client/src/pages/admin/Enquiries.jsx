import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Search, Filter, MessageSquare, ArrowRight, Clock } from 'lucide-react';

const STAGE_OPTIONS = ['All', 'New', 'Contacted', 'In Progress', 'Quoted', 'Completed', 'Closed'];

const STAGE_COLORS = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'In Progress': 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  Quoted: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  Completed: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  Closed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export default function AdminEnquiries() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-enquiries'],
    queryFn: async () => {
      const res = await api.get('/enquiries');
      return res.data.data;
    },
  });

  const enquiries = (data || []).map((e) => {
    const verticalDisplay =
      typeof e.vertical === 'object' && e.vertical !== null
        ? e.vertical.name || e.vertical.slug || 'General'
        : e.verticalTitle || e.vertical || e.verticalSlug || 'General';

    return {
      ...e,
      displayName: e.name || e.contactName || e.formData?.name || e.formData?.contactName || 'Anonymous',
      displayEmail: e.email || e.contactEmail || e.formData?.email || e.formData?.contactEmail || '—',
      displayPhone: e.phone || e.contactPhone || e.formData?.phone || '',
      displayStage: e.stage || e.currentStage || e.status || 'New',
      displayVertical: verticalDisplay,
      displayNumber: e.enquiryNumber || `ENQ-${e._id?.slice(-6)?.toUpperCase()}`,
    };
  });

  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      e.displayName.toLowerCase().includes(q) ||
      e.displayEmail.toLowerCase().includes(q) ||
      e.displayVertical.toLowerCase().includes(q) ||
      e.displayNumber.toLowerCase().includes(q);
    const matchStage = stageFilter === 'All' || e.displayStage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Enquiries</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} enquiry(ies) found</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card-glass p-4 flex flex-wrap gap-4 items-center justify-between rounded-2xl">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, enquiry # or vertical..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-full text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="input-field text-sm"
          >
            {STAGE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Stages' : s}</option>
            ))}
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
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-base font-medium">No client enquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3.5">Enquiry #</th>
                  <th className="px-5 py-3.5">Client Contact</th>
                  <th className="px-5 py-3.5">Vertical</th>
                  <th className="px-5 py-3.5">Stage</th>
                  <th className="px-5 py-3.5">Assigned To</th>
                  <th className="px-5 py-3.5">Received Date</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((e) => (
                  <tr
                    key={e._id}
                    onClick={() => navigate(`/admin/enquiries/${e._id}`)}
                    className="hover:bg-primary-50/40 dark:hover:bg-primary-950/20 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
                      {e.displayNumber}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{e.displayName}</div>
                      <div className="text-xs text-gray-500">{e.displayEmail}</div>
                      {e.displayPhone && <div className="text-xs text-gray-400">{e.displayPhone}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {e.displayVertical}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STAGE_COLORS[e.displayStage] || 'bg-gray-100 text-gray-600'}`}>
                        {e.displayStage}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-300">
                      {e.assignedTo?.name || e.assignedTo?.email || (typeof e.assignedTo === 'string' ? e.assignedTo : 'Unassigned')}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="btn-outline text-xs px-2.5 py-1 inline-flex items-center gap-1 text-primary-600">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
