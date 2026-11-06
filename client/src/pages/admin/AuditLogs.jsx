import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Shield, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function AdminAuditLogs() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', page, actionFilter, entityFilter],
    queryFn: async () => {
      const params = { page, limit };
      if (actionFilter) params.action = actionFilter;
      if (entityFilter) params.entity = entityFilter;
      const res = await api.get('/admin/audit-logs', { params });
      return res.data;
    },
  });

  const logs = data?.data || [];
  const pagination = data?.pagination || { pages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security & Audit Logs</h1>
        <p className="text-gray-500 text-sm mt-1">Immutable trail of administrative and manager events</p>
      </div>

      {/* Filters */}
      <div className="card-glass p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by action (e.g. LOGIN, CREATE, UPDATE)..."
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Entity (e.g. User, Course)..."
            value={entityFilter}
            onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card-glass overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No audit records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-left text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Entity</th>
                  <th className="px-5 py-3">Actor</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-xs">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-semibold text-primary-700">
                      {log.action}
                    </td>
                    <td className="px-5 py-3 text-gray-800">{log.entity || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {log.actorEmail || log.actor?.email || 'System'}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 uppercase">
                        {log.actorRole || 'System'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{log.ip || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {pagination.pages} ({pagination.total} total logs)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline text-sm px-3 py-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="btn-outline text-sm px-3 py-1.5 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
