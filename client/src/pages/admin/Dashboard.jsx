import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import {
  Users, MessageSquare, CheckSquare, UserCheck,
  BookOpen, Calendar, FileText, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];

function StatCard({ icon: Icon, label, value, subtitle, color }) {
  return (
    <div className="card-glass p-6 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? 0}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  const d = data || {};

  const membersByCategory = (d.membersByCategory || []).map((item) => ({
    name: item._id || 'Unknown',
    count: item.count,
  }));

  const enquiriesByVertical = (d.enquiriesByVertical || []).map((item, i) => ({
    name: item._id || 'Unknown',
    value: item.count,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="gradient-text">{user?.name || 'Admin'}</span>
        </h1>
        <p className="text-gray-500 mt-1">Here's an overview of your platform.</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Members"
          value={d.totalMembers}
          subtitle={`${d.activeMembers ?? 0} active · ${d.pendingMembers ?? 0} pending`}
          color="bg-primary-600"
        />
        <StatCard
          icon={MessageSquare}
          label="Enquiries"
          value={d.totalEnquiries}
          subtitle={`${d.openEnquiries ?? 0} open`}
          color="bg-violet-600"
        />
        <StatCard
          icon={CheckSquare}
          label="Tasks"
          value={d.totalTasks}
          subtitle={`${d.openTasks ?? 0} open · ${d.completedTasks ?? 0} done`}
          color="bg-cyan-600"
        />
        <StatCard
          icon={UserCheck}
          label="Experts"
          value={d.totalExperts}
          subtitle={`${d.verifiedExperts ?? 0} verified`}
          color="bg-emerald-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          icon={BookOpen}
          label="Courses"
          value={d.totalCourses}
          color="bg-amber-500"
        />
        <StatCard
          icon={Calendar}
          label="Events"
          value={d.totalEvents}
          color="bg-pink-500"
        />
        <StatCard
          icon={FileText}
          label="MoUs"
          value={d.totalMoUs}
          subtitle={`${d.activeMoUs ?? 0} active`}
          color="bg-purple-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Members by Category */}
        <div className="card-glass p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Members by Category
          </h3>
          {membersByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={membersByCategory}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {membersByCategory.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No data available</p>
          )}
        </div>

        {/* Pie Chart - Enquiries by Vertical */}
        <div className="card-glass p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-600" />
            Enquiries by Vertical
          </h3>
          {enquiriesByVertical.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={enquiriesByVertical}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {enquiriesByVertical.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
