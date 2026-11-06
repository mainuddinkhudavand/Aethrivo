import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, MapPin, Loader2, ChevronRight, AlertCircle, Users, DollarSign, Clock, Mic2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const initialForm = { name: '', email: '', phone: '', organisation: '' };

export default function EventDetail() {
  const { slug } = useParams();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const res = await api.get(`/api/public/events/${slug}`);
      return res.data.data;
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Name and email are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/api/public/events/${slug}/register`, form);
      toast.success('Registration successful! Check your email for confirmation.');
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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

  if (isError || !event) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
        <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events" className="btn-primary px-6 py-2 rounded-xl">Back to Events</Link>
      </div>
    );
  }

  const typeBadgeColors = {
    Conference: 'bg-purple-100 text-purple-700',
    Workshop: 'bg-blue-100 text-blue-700',
    Webinar: 'bg-cyan-100 text-cyan-700',
    Seminar: 'bg-indigo-100 text-indigo-700',
    Hackathon: 'bg-orange-100 text-orange-700',
    Meetup: 'bg-green-100 text-green-700',
  };

  return (
    <div className="font-body section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/events" className="hover:text-primary-600 transition-colors">Events</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium truncate">{event.title}</span>
        </nav>

        {/* Hero */}
        <div className="gradient-primary rounded-2xl p-8 md:p-12 mb-10">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {event.type && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeBadgeColors[event.type] || 'bg-white/20 text-white'}`}>
                {event.type}
              </span>
            )}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-6 text-white/80">
            <span className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              {formatDate(event.startDate)}
              {event.endDate && event.endDate !== event.startDate && ` — ${formatDate(event.endDate)}`}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {event.venue || 'Online'}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            {event.description && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">About this Event</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{event.description}</p>
              </section>
            )}

            {/* Agenda */}
            {event.agenda && Array.isArray(event.agenda) && event.agenda.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Agenda</h2>
                <div className="space-y-3">
                  {event.agenda.map((item, i) => (
                    <div key={i} className="card-glass rounded-xl p-4 flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        {item.time && <p className="text-sm font-medium text-primary-600">{item.time}</p>}
                        <p className="text-gray-700 dark:text-gray-300">
                          {typeof item === 'string' ? item : item.title || item.topic || JSON.stringify(item)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Speakers */}
            {event.speakers && Array.isArray(event.speakers) && event.speakers.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Speakers</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, i) => (
                    <div key={i} className="card-glass rounded-xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Mic2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {typeof speaker === 'string' ? speaker : speaker.name || ''}
                        </p>
                        {speaker.designation && (
                          <p className="text-sm text-gray-500">{speaker.designation}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tracks */}
            {event.tracks && Array.isArray(event.tracks) && event.tracks.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Tracks</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tracks.map((track, i) => (
                    <span key={i} className="text-sm px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 font-medium">
                      {typeof track === 'string' ? track : track.name || ''}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Fee */}
            {event.fee !== undefined && (
              <section className="card-glass rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Registration Fee</p>
                    <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                      {event.fee === 0 ? 'Free' : `₹${event.fee}`}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Registration Form Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card-glass rounded-2xl p-6 sticky top-24">
              <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white mb-6">Register for this Event</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-3 rounded-xl font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                  {submitting ? 'Registering...' : 'Register Now'}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
