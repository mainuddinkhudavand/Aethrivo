import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, Monitor, Award, DollarSign, ChevronRight, Loader2, BookOpen, CheckCircle2, AlertCircle, X, Send, Sparkles } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const levelColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

export default function CourseDetail() {
  const { slug } = useParams();
  const [enrollModal, setEnrollModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const res = await api.get(`/api/public/courses/${slug}`);
      return res.data.data;
    },
  });

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Name and email are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/enquiries', {
        ...form,
        contactName: form.name,
        contactEmail: form.email,
        contactPhone: form.phone,
        courseSlug: slug,
        courseTitle: course?.title,
        subject: `Course Enrollment Request: ${course?.title}`,
      });
      toast.success('Enrollment enquiry submitted successfully! Our admissions team will reach out shortly.');
      setEnrollModal(false);
      setForm({ name: '', email: '', phone: '', message: '' });
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

  if (isError || !course) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
        <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses" className="btn-primary px-6 py-2 rounded-xl">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="font-body section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/courses" className="hover:text-primary-600 transition-colors">Courses</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium truncate">{course.title}</span>
        </nav>

        {/* Hero */}
        <div className="gradient-primary rounded-2xl p-8 md:p-12 mb-10">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {course.category && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
                {course.category}
              </span>
            )}
            {course.level && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelColors[course.level] || 'bg-white/20 text-white'}`}>
                {course.level}
              </span>
            )}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">{course.title}</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            {course.description && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">About this Course</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{course.description}</p>
              </section>
            )}

            {/* Syllabus */}
            {course.syllabus && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Syllabus</h2>
                {Array.isArray(course.syllabus) ? (
                  <ul className="space-y-3">
                    {course.syllabus.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{typeof item === 'string' ? item : item.title || item.name || JSON.stringify(item)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{course.syllabus}</p>
                )}
              </section>
            )}

            {/* Prerequisites */}
            {course.prerequisites && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Prerequisites</h2>
                {Array.isArray(course.prerequisites) ? (
                  <ul className="space-y-2">
                    {course.prerequisites.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{course.prerequisites}</p>
                )}
              </section>
            )}

            {/* Outcomes */}
            {course.outcomes && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Learning Outcomes</h2>
                {Array.isArray(course.outcomes) ? (
                  <ul className="space-y-2">
                    {course.outcomes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{course.outcomes}</p>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card-glass rounded-2xl p-6 sticky top-24 space-y-6">
              <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white">Course Info</h3>
              <div className="space-y-4">
                {course.duration && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Duration</p>
                      <p className="text-gray-900 dark:text-white font-medium">{course.duration}</p>
                    </div>
                  </div>
                )}
                {course.fee !== undefined && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Fee</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {course.fee === 0 ? 'Free' : `₹${course.fee}`}
                      </p>
                    </div>
                  </div>
                )}
                {course.mode && (
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Mode</p>
                      <p className="text-gray-900 dark:text-white font-medium">{course.mode}</p>
                    </div>
                  </div>
                )}
                {course.certification !== undefined && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Certification</p>
                      <p className="text-gray-900 dark:text-white font-medium">{course.certification ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setEnrollModal(true)}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-md"
              >
                <Sparkles className="w-4 h-4" /> Enroll / Enquire Now
              </button>
            </div>
          </aside>
        </div>

        {/* Enrollment Modal */}
        {enrollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="card-glass w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white">Enrollment Enquiry</h3>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{course.title}</p>
                </div>
                <button onClick={() => setEnrollModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Special Requirements or Query</label>
                  <textarea
                    rows={3}
                    placeholder="Are you seeking corporate sponsorship, group discount, or customized timing?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEnrollModal(false)} className="btn-outline flex-1 text-sm py-2">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-2 font-semibold"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? 'Submitting...' : 'Submit Enquiry'}
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
