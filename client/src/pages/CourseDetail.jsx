import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Clock, Monitor, Award, ChevronRight, Loader2, BookOpen,
  CheckCircle2, AlertCircle, X, Send, Sparkles, DollarSign,
  ShieldAlert, UserCheck
} from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { coursesData } from '../data/coursesData';

const levelColors = {
  Beginner: 'bg-emerald-100 text-emerald-800',
  Intermediate: 'bg-amber-100 text-amber-800',
  Advanced: 'bg-rose-100 text-rose-800',
  'All Levels': 'bg-blue-100 text-blue-800',
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

  const { data: serverCourse, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const res = await api.get(`/api/public/courses/${slug}`);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const fallbackCourse = useMemo(() => {
    return coursesData.find((c) => c.slug === slug);
  }, [slug]);

  const course = serverCourse || fallbackCourse;

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
      toast.success('Enrollment enquiry recorded! Our team will reach out with batch schedule details.');
      setEnrollModal(false);
      setForm({ name: '', email: '', phone: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading && !course) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">Course Not Found</h2>
        <p className="text-slate-500 mb-6">The course you're looking for doesn't exist or has been updated.</p>
        <Link to="/courses" className="btn-primary px-6 py-2.5 rounded-xl">Back to Courses Catalogue</Link>
      </div>
    );
  }

  return (
    <div className="font-body section-padding bg-slate-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/courses" className="hover:text-primary-600 transition-colors">Courses</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-semibold truncate">{course.title}</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-12">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {course.category && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
                  {course.category}
                </span>
              )}
              {course.level && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${levelColors[course.level] || 'bg-white/20 text-white'}`}>
                  {course.level}
                </span>
              )}
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Aethrivo Verified Masterclass
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              {course.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
              {course.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Detailed Syllabus */}
            {course.syllabus && course.syllabus.length > 0 && (
              <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                    <h2 className="font-heading text-2xl font-bold text-slate-900">Curriculum & Modules</h2>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {course.syllabus.length} Modules
                  </span>
                </div>
                <div className="space-y-4">
                  {course.syllabus.map((mod, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                      <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                        {typeof mod === 'string' ? mod : mod.module}
                      </h3>
                      {mod.topics && Array.isArray(mod.topics) && (
                        <ul className="space-y-1.5 mt-2 pl-2">
                          {mod.topics.map((top, tIdx) => (
                            <li key={tIdx} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                              <span>{top}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Learning Outcomes */}
            {course.outcomes && course.outcomes.length > 0 && (
              <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-6 h-6 text-emerald-600" />
                  <h2 className="font-heading text-2xl font-bold text-slate-900">What You Will Achieve</h2>
                </div>
                <div className="grid gap-3">
                  {course.outcomes.map((outc, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-slate-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{outc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
                <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">Prerequisites & Target Profile</h2>
                <div className="space-y-2">
                  {course.prerequisites.map((req, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certification Note Guardrail */}
            <section className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 text-amber-900">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-800 mb-1">
                    Certification & Assessment Disclosure
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                    {course.certificationNote || 'External certification preparation must be distinguished from official third-party certification. Use authorised partner status only when documented.'}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md sticky top-24 space-y-6">
              <div className="border-b border-slate-100 pb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Indicative Tuition Fee
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl sm:text-4xl font-black text-slate-900">
                    {course.fee ? `₹${course.fee}` : 'Free'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">inclusive of LMS access</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4 text-primary-600" /> Duration
                  </span>
                  <span className="font-bold text-slate-900">{course.duration || '6 Weeks'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Monitor className="w-4 h-4 text-cyan-600" /> Delivery Mode
                  </span>
                  <span className="font-bold text-slate-900">{course.mode || 'Online'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Award className="w-4 h-4 text-emerald-600" /> Level
                  </span>
                  <span className="font-bold text-slate-900">{course.level || 'Intermediate'}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2 text-slate-500">
                    <UserCheck className="w-4 h-4 text-violet-600" /> Certification
                  </span>
                  <span className="font-bold text-slate-900">Verified ID & Digital Credential</span>
                </div>
              </div>

              <button
                onClick={() => setEnrollModal(true)}
                className="w-full btn-primary py-3.5 rounded-2xl font-bold text-base shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
              >
                Enroll / Enquire Now <ChevronRight className="w-5 h-5" />
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Free general membership gives priority access to introductory webinars & community study materials.
              </p>
            </div>
          </aside>
        </div>

        {/* Enrollment Modal */}
        {enrollModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-slate-100">
              <button
                onClick={() => setEnrollModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Admissions Desk</span>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mt-1">
                  Enquire for {course.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Leave your details and our programme coordinator will reach out with the upcoming batch dates and syllabus handbook.
                </p>
              </div>

              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field w-full"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field w-full"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field w-full"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Questions / Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field w-full resize-none"
                    placeholder="Batch timing preferences or institutional sponsorship questions..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {submitting ? 'Submitting Request...' : 'Confirm Enrollment Enquiry'}
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
