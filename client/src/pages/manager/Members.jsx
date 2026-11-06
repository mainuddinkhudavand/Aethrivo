import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Users, Search, Filter, X, User, Mail, Phone, MapPin } from 'lucide-react';

const STATUS_COLORS = {
  Active: 'bg-green-100 text-green-700',
  Submitted: 'bg-amber-100 text-amber-700',
  'Under Review': 'bg-blue-100 text-blue-700',
  Suspended: 'bg-red-100 text-red-700',
  Rejected: 'bg-red-100 text-red-700',
};

export default function ManagerMembers() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['manager-members'],
    queryFn: async () => {
      const res = await api.get('/members');
      return res.data.data;
    },
  });

  const members = data || [];
  const categories = ['All', ...new Set(members.map((m) => m.category).filter(Boolean))];

  const filtered = members.filter((m) => {
    const matchSearch =
      !search ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.memberId?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Directory</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} member profiles (Read-Only)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card-glass p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search members by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
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
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No members found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-left text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3">Member ID</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((m) => (
                  <tr
                    key={m._id}
                    onClick={() => setSelectedMember(m)}
                    className="hover:bg-primary-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{m.memberId || '—'}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{m.name}</td>
                    <td className="px-5 py-3 text-gray-600">{m.email}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                        {m.category || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[m.status] || 'bg-gray-100 text-gray-600'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="card-glass w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedMember.name}</h2>
                  <span className="text-xs text-gray-400 font-mono">{selectedMember.memberId || 'No ID'}</span>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm divide-y divide-gray-100">
              <div className="pt-2 flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" /> {selectedMember.email}
              </div>
              {selectedMember.phone && (
                <div className="pt-2 flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" /> {selectedMember.phone}
                </div>
              )}
              {selectedMember.city && (
                <div className="pt-2 flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" /> {selectedMember.city}, {selectedMember.state}, {selectedMember.country}
                </div>
              )}
              <div className="pt-2 flex justify-between">
                <span className="text-gray-500">Membership Category</span>
                <span className="font-semibold text-gray-800">{selectedMember.category}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-500">Current Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedMember.status] || ''}`}>
                  {selectedMember.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
