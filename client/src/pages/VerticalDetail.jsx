import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronRight, AlertCircle, Layers, CheckCircle2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

const initialForm = { name: '', email: '', phone: '', organisation: '', message: '' };

export default function VerticalDetail() {
  const { slug } = useParams();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const { data: vertical, isLoading, isError } = useQuery({
    queryKey: ['vertical', slug],
    queryFn: async () => {
      const res = await api.get(`/api/verticals/${slug}`);
      return res.data.data;
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Name, email, and message are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/enquiries', {
        ...form,
        verticalSlug: slug,
      });
      toast.success('Enquiry submitted successfully! We will get back to you soon.');
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (isError || !vertical) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-2">Vertical Not Found</h2>
        <p className="text-gray-500 mb-6">The vertical you're looking for doesn't exist or has been removed.</p>
        <Link to="/verticals" className="btn-primary px-6 py-2 rounded-xl">Back to Verticals</Link>
      </div>
    );
  }

  const services = vertical.services || vertical.servicesCatalogue || vertical.catalogue || [];

  return (
    <div className="font-body section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/verticals" className="hover:text-primary-600 transition-colors">Verticals</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium truncate">{vertical.name}</span>
        </nav>

        {/* Hero */}
        <div className="gradient-primary rounded-2xl p-8 md:p-12 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Layers className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">{vertical.name}</h1>
        </div>

        {/* Description */}
        {vertical.description && (
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{vertical.description}</p>
          </section>
        )}

        {/* Services Catalogue */}
        {Array.isArray(services) && services.length > 0 && (
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">Services Catalogue</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((service, i) => (
                <div key={i} className="card-glass rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {typeof service === 'string' ? service : service.name || service.title || JSON.stringify(service)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Enquiry Form */}
        <section className="card-glass rounded-2xl p-8 md:p-10">
          <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-2">Enquire About This Vertical</h2>
          <p className="text-gray-500 mb-8">Fill out the form below and our team will get back to you.</p>

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organisation</label>
              <input
                type="text"
                name="organisation"
                value={form.organisation}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Your organisation"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vertical</label>
              <input
                type="text"
                value={vertical.name}
                disabled
                className="input-field w-full bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="input-field w-full resize-none"
                placeholder="Tell us about your requirements..."
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8 py-3 rounded-xl font-semibold disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {submitting ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
