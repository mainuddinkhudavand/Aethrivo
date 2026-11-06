import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search, Loader2, Globe, User2, Languages, Briefcase, Award,
  Calendar, Send, X, CheckCircle, Sparkles, Filter
} from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Experts() {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [consultModal, setConsultModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Advisory Consultation',
    message: '',
  });

  const { data: rawExperts, isLoading } = useQuery({
    queryKey: ['public-experts'],
    queryFn: async () => {
      const res = await api.get('/api/public/experts');
      return res.data.data;
    },
  });

  const experts = useMemo(() => {
    if (!rawExperts) return [];
    return rawExperts.map((exp) => ({
      ...exp,
      displayName: exp.fullName || exp.name || 'Domain Specialist',
      tags: exp.expertiseTags && exp.expertiseTags.length > 0 ? exp.expertiseTags : (exp.domains || []),
      langs: exp.languages || [],
    }));
  }, [rawExperts]);

  const allDomains = useMemo(() => {
    if (!experts) return [];
    const domainSet = new Set();
    experts.forEach((e) => {
      if (Array.isArray(e.tags)) e.tags.forEach((d) => domainSet.add(d));
    });
    return [...domainSet].sort();
  }, [experts]);

  const filtered = useMemo(() => {
    if (!experts) return [];
    return experts.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        e.displayName.toLowerCase().includes(q) ||
        (e.bio && e.bio.toLowerCase().includes(q)) ||
        (e.experience && e.experience.toLowerCase().includes(q)) ||
        e.tags.some((t) => t.toLowerCase().includes(q));
      const matchesDomain = !domainFilter || e.tags.includes(domainFilter);
      return matchesSearch && matchesDomain;
    });
  }, [experts, search, domainFilter]);

  const modeLabel = (mode) => {
    if (!mode) return 'Online & Offline';
    const m = mode.toLowerCase();
    if (m === 'both') return 'Online & Offline';
    return mode;
  };

  const handleOpenConsult = (expert) => {
    setSelectedExpert(expert);
    setForm({
      name: '',
      email: '',
      phone: '',
      serviceType: 'Advisory Consultation',
      message: `I would like to connect with ${expert.displayName} regarding domain consultation.`,
    });
    setConsultModal(true);
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/enquiries', {
        ...form,
        contactName: form.name,
        contactEmail: form.email,
        contactPhone: form.phone,
        expertId: selectedExpert?._id,
        expertName: selectedExpert?.displayName,
        subject: `Expert Consultation Request: ${selectedExpert?.displayName}`,
      });
      toast.success('Consultation request sent successfully! Our team will coordinate with the expert.');
      setConsultModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-body section-padding min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Technical & Legal Luminaries
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text mb-4">
            Aethrivo Expert Directory
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Directly connect with top patent attorneys, AI research scientists, IP valuation masters, and corporate advisors.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card-glass rounded-2xl p-4 mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, expertise, bio, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 w-full text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="input-field text-sm min-w-[200px] w-full sm:w-auto"
            >
              <option value="">All Domains ({allDomains.length})</option>
              {allDomains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            <p className="text-sm text-gray-500">Loading verified experts...</p>
          </div>
        )}

        {/* Expert Grid */}
        {!isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((expert) => (
              <div
                key={expert._id || expert.displayName}
                className="card-glass rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-primary-400/50 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 text-white font-bold text-xl shadow-md">
                      {expert.displayName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white truncate">
                          {expert.displayName}
                        </h3>
                        <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      </div>
                      {expert.experience && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" /> {expert.experience}
                        </p>
                      )}
                      <span className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1 mt-1 font-medium">
                        <Globe className="w-3.5 h-3.5" /> {modeLabel(expert.mode)}
                      </span>
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  {expert.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {expert.tags.map((t) => (
                        <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-medium border border-primary-200/50 dark:border-primary-800/40">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Languages */}
                  {expert.langs.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500 dark:text-gray-400">
                      <Languages className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                      <span>Languages: {expert.langs.join(', ')}</span>
                    </div>
                  )}

                  {/* Bio */}
                  {expert.bio && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {expert.bio}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                  <div className="text-xs text-gray-400">
                    {expert.availability || 'Available for Sessions'}
                  </div>
                  <button
                    onClick={() => handleOpenConsult(expert)}
                    className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-semibold"
                  >
                    <Send className="w-3.5 h-3.5" /> Request Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="card-glass rounded-2xl text-center py-20 max-w-lg mx-auto">
            <User2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-bold text-gray-800 dark:text-white mb-1">No experts found</h3>
            <p className="text-gray-500 text-sm mb-6">Try clearing filters or adjusting your search keywords.</p>
            <button
              onClick={() => { setSearch(''); setDomainFilter(''); }}
              className="btn-outline text-xs px-4 py-2"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* Consultation Modal */}
        {consultModal && selectedExpert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="card-glass w-full max-w-lg p-6 rounded-2xl shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Request Consultation</h2>
                  <p className="text-xs text-gray-500">Connecting with {selectedExpert.displayName}</p>
                </div>
                <button onClick={() => setConsultModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Service Type</label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                    className="input-field w-full text-sm"
                  >
                    <option value="Advisory Consultation">Advisory Consultation</option>
                    <option value="Patent Drafting & Prior Art">Patent Drafting & Prior Art</option>
                    <option value="Corporate / FDP Training">Corporate / FDP Training</option>
                    <option value="Guest Lecture & Workshop">Guest Lecture & Workshop</option>
                    <option value="Technical Advisory Board">Technical Advisory Board</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Scope / Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field w-full text-sm"
                    placeholder="Describe your innovation, question, or objective..."
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setConsultModal(false)}
                    className="btn-outline flex-1 text-sm py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? 'Submitting...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
