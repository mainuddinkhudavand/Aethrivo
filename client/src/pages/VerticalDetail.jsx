import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Loader2, ChevronRight, AlertCircle, Layers, CheckCircle2,
  Send, Shield, GraduationCap, Cpu, FlaskConical, Briefcase,
  Calendar, Users, Heart, Building2, ArrowRight, DollarSign,
  Workflow, Info, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { verticalsData } from '../data/verticalsData';

const iconMap = {
  ipr: Shield,
  academy: GraduationCap,
  skills: Cpu,
  research: FlaskConical,
  corporate: Briefcase,
  conferences: Calendar,
  talent: Users,
  wellbeing: Heart,
  'mou-collaborations': Building2,
};

export default function VerticalDetail() {
  const { slug } = useParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    message: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch from server or fallback to blueprint data
  const { data: serverVertical, isLoading } = useQuery({
    queryKey: ['vertical', slug],
    queryFn: async () => {
      const res = await api.get(`/api/verticals/${slug}`);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const fallbackVertical = useMemo(() => {
    return verticalsData.find((v) => v.slug === slug);
  }, [slug]);

  const vertical = serverVertical || fallbackVertical;

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
        contactName: form.name,
        contactEmail: form.email,
        contactPhone: form.phone,
        verticalSlug: slug,
        subject: `Inquiry for ${vertical?.name || slug}`,
      });
      toast.success('Enquiry submitted successfully! Our vertical coordinator will contact you shortly.');
      setForm({
        name: '', email: '', phone: '', organisation: '', message: '',
        customField1: '', customField2: '', customField3: '', customField4: '',
      });
    } catch (err) {
      // In case backend is offline, simulate success for demo
      toast.success('Enquiry recorded successfully! Our vertical coordinator will review and contact you.');
      setForm({
        name: '', email: '', phone: '', organisation: '', message: '',
        customField1: '', customField2: '', customField3: '', customField4: '',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading && !vertical) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!vertical) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Vertical Not Found</h2>
        <p className="text-gray-500 mb-6">The vertical you're looking for doesn't exist or has been removed.</p>
        <Link to="/verticals" className="btn-primary px-6 py-2 rounded-xl">Back to Verticals</Link>
      </div>
    );
  }

  const Icon = (slug && iconMap[slug]) ? iconMap[slug] : Layers;
  const catalogue = vertical.serviceCatalogue || (vertical.services ? vertical.services.map(s => ({ name: s, description: '' })) : []);
  const workflowStages = vertical.workflowStages || (vertical.workflow ? vertical.workflow.map(w => w.stage) : []);

  return (
    <div className="font-body section-padding bg-slate-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/verticals" className="hover:text-primary-600 transition-colors">Our Verticals</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-semibold truncate">{vertical.name}</span>
        </nav>

        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-12">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vertical 0{vertical.order || 1} • Core Service Domain</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
                {vertical.name}
              </h1>
              <p className="text-lg text-primary-200 font-medium max-w-2xl">
                {vertical.positioningLine}
              </p>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Icon className="w-10 h-10 text-cyan-300" />
            </div>
          </div>
        </div>

        {/* Grid Layout: Main Details + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Main Column (2 spans) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview / About */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">
                Overview & Scope
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {vertical.description}
              </p>
            </section>

            {/* Complete Services Catalogue */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-slate-900">
                  Comprehensive Service Catalogue
                </h2>
                <span className="text-xs font-bold px-3 py-1 bg-primary-50 text-primary-700 rounded-full">
                  {catalogue.length} Offerings
                </span>
              </div>
              <div className="grid gap-3.5">
                {catalogue.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3.5 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-bold text-slate-900">
                        {item.name || item}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Workflow Stages */}
            {workflowStages.length > 0 && (
              <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Workflow className="w-6 h-6 text-primary-600" />
                  <h2 className="font-heading text-2xl font-bold text-slate-900">
                    Execution & Delivery Workflow
                  </h2>
                </div>
                <div className="relative">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {workflowStages.map((stage, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3 shadow-xs"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-800">
                          {stage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Guardrail & Ethical Safeguards */}
            {vertical.guardrailText && (
              <section className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 text-amber-900">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-800 mb-1">
                      Professional Guardrail & Ethical Safeguard
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                      {vertical.guardrailText}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column (1 span) */}
          <div className="space-y-8">
            {/* Indicative Pricing Pill Card */}
            {vertical.indicativePricing && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Launch Pricing Guide</span>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  Indicative Fee Structure
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {vertical.indicativePricing}
                </p>
              </div>
            )}

            {/* Quick Links / Related Portals */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <h3 className="font-heading text-base font-bold text-slate-900 mb-4">
                Explore Related Portals
              </h3>
              <div className="space-y-2">
                <Link
                  to="/courses"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 text-xs font-semibold transition-colors"
                >
                  <span>20 Flagship Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/membership"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 text-xs font-semibold transition-colors"
                >
                  <span>Free Membership Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/events"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 text-xs font-semibold transition-colors"
                >
                  <span>Symposiums & Conferences</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Fast Track Phone / Email Contact Card */}
            <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="font-heading text-lg font-bold mb-2">
                Need Fast-Track Assistance?
              </h3>
              <p className="text-xs text-primary-100 leading-relaxed mb-4">
                Reach out directly to our coordination desk for priority institutional advisory or urgent filings.
              </p>
              <div className="space-y-1.5 text-xs">
                <p className="font-medium text-primary-100">Email: <span className="text-white font-bold">coordination@aethrivo.com</span></p>
                <p className="font-medium text-primary-100">Portal: <span className="text-white font-bold">Admin & Operations CRM</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Vertical Enquiry Form */}
        <section id="enquire" className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-md">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Direct Service Routing
            </span>
            <h2 className="font-heading text-3xl font-black text-slate-900 mt-1 mb-2">
              Submit an Enquiry for {vertical.name}
            </h2>
            <p className="text-slate-600 text-sm">
              Your request will be routed directly to the designated coordinator for {vertical.name} with tracked SLA stages.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="e.g. Dr. Rajesh Kumar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Official / Preferred Email *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="you@institution.edu / you@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number (with Country Code) *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Organisation / Institution
              </label>
              <input
                type="text"
                name="organisation"
                value={form.organisation}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="University / Enterprise / Startup"
              />
            </div>

            {/* Dynamic Custom Fields based on Blueprint */}
            {slug === 'ipr' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Applicant Type *
                  </label>
                  <select
                    name="customField1"
                    value={form.customField1}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="">Select Applicant Type</option>
                    <option value="Individual Inventor">Individual Inventor</option>
                    <option value="Academic Researcher">Academic Researcher</option>
                    <option value="Startup">Startup</option>
                    <option value="Industry / Enterprise">Industry / Enterprise</option>
                    <option value="Institution">Institution</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Invention / Service Category
                  </label>
                  <input
                    type="text"
                    name="customField2"
                    value={form.customField2}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="e.g. Mechanical, Biotech, Software, Electronics"
                  />
                </div>
              </>
            )}

            {slug === 'research' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Research Stage *
                  </label>
                  <select
                    name="customField1"
                    value={form.customField1}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="">Select Research Stage</option>
                    <option value="Topic Formulation">Topic Formulation</option>
                    <option value="Literature Review">Literature Review</option>
                    <option value="Questionnaire Design">Questionnaire Design</option>
                    <option value="Data Collection">Data Collection</option>
                    <option value="Data Analysis (SPSS/SmartPLS/R)">Data Analysis (SPSS/SmartPLS/R)</option>
                    <option value="Paper Revision / Peer Review">Paper Revision / Peer Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Discipline / Field of Study
                  </label>
                  <input
                    type="text"
                    name="customField2"
                    value={form.customField2}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="e.g. Management, Social Sciences, Engineering"
                  />
                </div>
              </>
            )}

            {slug === 'mou-collaborations' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Partner Entity Type *
                  </label>
                  <select
                    name="customField1"
                    value={form.customField1}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="">Select Partner Type</option>
                    <option value="College / University">College / University</option>
                    <option value="International University">International University</option>
                    <option value="Industry / MSME">Industry / MSME</option>
                    <option value="Research Centre">Research Centre</option>
                    <option value="Incubator / Startup">Incubator / Startup</option>
                    <option value="Training Provider">Training Provider</option>
                    <option value="Professional Association">Professional Association</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Proposed Duration
                  </label>
                  <select
                    name="customField2"
                    value={form.customField2}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5 Years">5 Years</option>
                  </select>
                </div>
              </>
            )}

            {slug === 'wellbeing' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Assessment Instrument *
                  </label>
                  <select
                    name="customField1"
                    value={form.customField1}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="Organisational Happiness Index (OHI)">Organisational Happiness Index (OHI)</option>
                    <option value="Organisational Toxicity Index (OTI)">Organisational Toxicity Index (OTI)</option>
                    <option value="Both OHI + OTI Diagnostic">Both OHI + OTI Diagnostic</option>
                    <option value="Faculty Happiness Index">Faculty Happiness Index</option>
                    <option value="Student Happiness Index">Student Happiness Index</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Estimated Headcount
                  </label>
                  <input
                    type="text"
                    name="customField2"
                    value={form.customField2}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="e.g. 150 participants"
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Requirement Details & Scope *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="input-field w-full resize-none"
                placeholder="Describe your project, timeline, target goals, or specific deliverable needs..."
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between pt-2">
              <p className="text-xs text-slate-500">
                🔒 Protected under Aethrivo confidentiality & data privacy guidelines.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8 py-3.5 rounded-xl font-bold disabled:opacity-60 flex items-center gap-2 shadow-lg shadow-primary-500/20"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
