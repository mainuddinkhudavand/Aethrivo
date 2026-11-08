import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle, User2, Calendar, Shield, CreditCard } from 'lucide-react';
import api from '../lib/api';

export default function MemberCard() {
  const { memberId } = useParams();

  const { data: member, isLoading, isError } = useQuery({
    queryKey: ['member-card', memberId],
    queryFn: async () => {
      const res = await api.get(`/api/members/card/${memberId}`);
      return res.data.data || res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-2">Member Not Found</h2>
        <p className="text-gray-500">The member card you're looking for doesn't exist.</p>
      </div>
    );
  }

  const statusColors = {
    Active: 'bg-green-100 text-green-700 border-green-300',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Under Review': 'bg-blue-100 text-blue-700 border-blue-300',
    Expired: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <div className="font-body min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 gradient-primary opacity-80 rounded-3xl" />
          <div className="relative m-[3px] rounded-[22px] bg-white dark:bg-gray-900 overflow-hidden">
            {/* Card Header */}
            <div className="gradient-primary px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Aethrivo</p>
                  <p className="text-white text-sm font-medium mt-1">Member Card</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="px-8 py-8">
              <div className="flex items-center gap-5 mb-8">
                {/* Photo Placeholder */}
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <User2 className="w-10 h-10 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h2>
                  {member.category && (
                    <span className="text-sm text-primary-600 font-medium">{member.category}</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Member ID */}
                {(member.memberId || member._id) && (
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Member ID</p>
                      <p className="text-gray-900 dark:text-white font-mono font-medium text-sm">{member.memberId || member._id}</p>
                    </div>
                  </div>
                )}

                {/* Status */}
                {member.status && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[member.status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Valid Until */}
                {member.validUntil && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Valid Until</p>
                      <p className="text-gray-900 dark:text-white font-medium text-sm">
                        {new Date(member.validUntil).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                This is a digital member card issued by Aethrivo. Verify at aethrivo.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
