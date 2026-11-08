import { useState, useRef } from 'react';
import { GraduationCap, Briefcase, Building2, FlaskConical, User2, BookOpen, Lightbulb, Building, Users, ChevronRight, ChevronLeft, Loader2, CheckCircle2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

const categories = [
  { key: 'Student', label: 'Student', icon: GraduationCap, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { key: 'Faculty', label: 'Faculty', icon: BookOpen, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { key: 'Industry', label: 'Industry', icon: Briefcase, color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { key: 'Research Scholar', label: 'Research Scholar', icon: FlaskConical, color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  { key: 'Expert', label: 'Expert', icon: User2, color: 'bg-green-50 text-green-600 border-green-200' },
  { key: 'Trainer', label: 'Trainer', icon: Users, color: 'bg-pink-50 text-pink-600 border-pink-200' },
  { key: 'Consultant', label: 'Consultant', icon: Lightbulb, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { key: 'Entrepreneur', label: 'Entrepreneur', icon: Building2, color: 'bg-red-50 text-red-600 border-red-200' },
  { key: 'Institution', label: 'Institution', icon: Building, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
];

const categoryFields = {
  Student: [
    { name: 'institution', label: 'Institution', type: 'text', required: true },
    { name: 'course', label: 'Course', type: 'text', required: true },
    { name: 'year', label: 'Year', type: 'text' },
    { name: 'studentId', label: 'Student ID', type: 'text' },
  ],
  Faculty: [
    { name: 'institution', label: 'Institution', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'text', required: true },
    { name: 'designation', label: 'Designation', type: 'text' },
    { name: 'experience', label: 'Experience (years)', type: 'text' },
  ],
  Industry: [
    { name: 'company', label: 'Company', type: 'text', required: true },
    { name: 'designation', label: 'Designation', type: 'text' },
    { name: 'sector', label: 'Sector', type: 'text' },
    { name: 'experience', label: 'Experience (years)', type: 'text' },
  ],
  'Research Scholar': [
    { name: 'institution', label: 'Institution', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'researchArea', label: 'Research Area', type: 'text', required: true },
    { name: 'supervisor', label: 'Supervisor', type: 'text' },
  ],
  Expert: [
    { name: 'organisation', label: 'Organisation', type: 'text' },
    { name: 'specialization', label: 'Specialization', type: 'text', required: true },
    { name: 'experience', label: 'Experience (years)', type: 'text' },
    { name: 'linkedin', label: 'LinkedIn Profile URL', type: 'url' },
    { name: 'cv', label: 'Upload CV', type: 'file' },
  ],
  Trainer: [
    { name: 'organisation', label: 'Organisation', type: 'text' },
    { name: 'specialization', label: 'Specialization', type: 'text', required: true },
    { name: 'experience', label: 'Experience (years)', type: 'text' },
    { name: 'linkedin', label: 'LinkedIn Profile URL', type: 'url' },
    { name: 'cv', label: 'Upload CV', type: 'file' },
  ],
  Consultant: [
    { name: 'organisation', label: 'Organisation', type: 'text' },
    { name: 'specialization', label: 'Specialization', type: 'text', required: true },
    { name: 'experience', label: 'Experience (years)', type: 'text' },
    { name: 'linkedin', label: 'LinkedIn Profile URL', type: 'url' },
    { name: 'cv', label: 'Upload CV', type: 'file' },
  ],
  Entrepreneur: [
    { name: 'company', label: 'Company', type: 'text', required: true },
    { name: 'sector', label: 'Sector', type: 'text' },
    { name: 'founded', label: 'Year Founded', type: 'text' },
    { name: 'website', label: 'Website', type: 'url' },
  ],
  Institution: [
    { name: 'institutionName', label: 'Institution Name', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'website', label: 'Website', type: 'url' },
    { name: 'contactPerson', label: 'Contact Person', type: 'text' },
  ],
};

const STEPS = ['Category', 'Personal Info', 'Details', 'Review & Submit'];

const qualificationOptions = [
  'SSLC / 10th',
  'PUC / 12th',
  'ITI',
  'Diploma',
  'Undergraduate degree',
  'Postgraduate degree',
  'MBA / MCA',
  'M.Tech / M.E.',
  'M.Sc.',
  'M.Phil.',
  'Ph.D.',
  'Postdoctoral',
  'Professional qualification',
  'Other',
];

const domainExpertiseOptions = [
  'Management (HR, leadership, marketing, finance, strategy)',
  'Project management (Agile, Scrum, Jira, PMP, Primavera P6)',
  'Data analytics (Power BI, Excel, Tableau, SQL, Python, R)',
  'Artificial intelligence (Gen AI, prompt engineering, AI agents)',
  'Software / IT (Java, Python, React, Node.js, Cloud, Docker)',
  'Engineering (AutoCAD, SolidWorks, CATIA, ANSYS, MATLAB)',
  'Research (SPSS, AMOS, SmartPLS, NVivo, Bibliometrics)',
  'IPR (Patent search, drafting, trademarks, copyright)',
  'Education (FDP, SDP, teaching, curriculum, OBE)',
  'Digital marketing (SEO, Google Ads, Meta Ads, analytics)',
  'Corporate (Six Sigma, Lean, Kaizen, OKR, performance)',
  'Entrepreneurship (Business model, startup, pitch deck)',
  'Wellbeing (Workplace culture, employee engagement, OHI/OTI)',
];

export default function Membership() {
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [personal, setPersonal] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    domainExpertise: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
  });
  const [categoryData, setCategoryData] = useState({});
  const [cvFile, setCvFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);

  const handlePersonalChange = (e) => {
    setPersonal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryDataChange = (e) => {
    setCategoryData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const canProceed = () => {
    if (step === 0) return !!selectedCategory;
    if (step === 1) return personal.name && personal.email && personal.phone;
    if (step === 2) {
      const fields = categoryFields[selectedCategory] || [];
      return fields.filter((f) => f.required).every((f) => categoryData[f.name]);
    }
    if (step === 3) return consent;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const hasFile = cvFile && ['Expert', 'Trainer', 'Consultant'].includes(selectedCategory);
      const payload = {
        category: selectedCategory,
        fullName: personal.name,
        name: personal.name,
        email: personal.email,
        phone: personal.phone,
        address: personal.address,
        city: personal.city,
        state: personal.state,
        country: personal.country,
        categoryFields: categoryData,
        ...categoryData,
      };

      if (hasFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (typeof v === 'object' && v !== null) {
            formData.append(k, JSON.stringify(v));
          } else if (v !== undefined && v !== '') {
            formData.append(k, v);
          }
        });
        formData.append('cv', cvFile);
        await api.post('/api/members/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/api/members/register', payload);
      }
      setSubmitted(true);
      toast.success('Registration successful! Please check your email.');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="font-body section-padding">
        <div className="max-w-lg mx-auto text-center">
          <div className="card-glass rounded-2xl p-10">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-4">Registration Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Check your email for a verification link. Once verified, your membership will be reviewed by our team.
            </p>
            <a href="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-body section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text mb-4">Become a Member</h1>
          <p className="text-gray-600 dark:text-gray-400">Join the Aethrivo community in 4 simple steps.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0 ${
                  i <= step ? 'gradient-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${i < step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {STEPS.map((label, i) => (
              <span key={label} className={`text-xs font-medium ${i <= step ? 'text-primary-600' : 'text-gray-400'}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6 md:p-10">
          {/* Step 0: Category */}
          {step === 0 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">Select Your Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => { setSelectedCategory(cat.key); setCategoryData({}); setCvFile(null); }}
                    className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                      selectedCategory === cat.key
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 shadow-lg scale-[1.03]'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <cat.icon className={`w-8 h-8 ${selectedCategory === cat.key ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span className={`text-sm font-semibold ${selectedCategory === cat.key ? 'text-primary-700' : 'text-gray-700 dark:text-gray-300'}`}>
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={personal.name}
                    onChange={handlePersonalChange}
                    placeholder="Your full name"
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email ID *</label>
                  <input
                    type="email"
                    name="email"
                    value={personal.email}
                    onChange={handlePersonalChange}
                    placeholder="you@example.com"
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={personal.phone}
                    onChange={handlePersonalChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Highest Qualification *</label>
                  <select
                    name="qualification"
                    value={personal.qualification}
                    onChange={handlePersonalChange}
                    className="input-field w-full"
                  >
                    <option value="">Select Qualification</option>
                    {qualificationOptions.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domain Expertise *</label>
                  <select
                    name="domainExpertise"
                    value={personal.domainExpertise}
                    onChange={handlePersonalChange}
                    className="input-field w-full"
                  >
                    <option value="">Select Primary Domain Expertise</option>
                    {domainExpertiseOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={personal.city}
                    onChange={handlePersonalChange}
                    placeholder="e.g. Bengaluru, Mumbai, Pune"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={personal.country}
                    onChange={handlePersonalChange}
                    placeholder="Country"
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Category-Specific */}
          {step === 2 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">{selectedCategory} Details</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {(categoryFields[selectedCategory] || []).map((field) => (
                  <div key={field.name} className={field.type === 'file' ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label} {field.required && '*'}
                    </label>
                    {field.type === 'file' ? (
                      <div>
                        <input
                          ref={fileRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="btn-outline px-4 py-2 rounded-xl text-sm inline-flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {cvFile ? cvFile.name : 'Choose File'}
                        </button>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={categoryData[field.name] || ''}
                        onChange={handleCategoryDataChange}
                        className="input-field w-full"
                        placeholder={field.label}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">Review & Submit</h2>
              <div className="space-y-6">
                <div className="card p-5 rounded-xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Category</h3>
                  <p className="text-primary-600 font-medium">{selectedCategory}</p>
                </div>
                <div className="card p-5 rounded-xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    {Object.entries(personal).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-gray-500 capitalize">{k}: </span>
                        <span className="text-gray-900 dark:text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card p-5 rounded-xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{selectedCategory} Details</h3>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    {Object.entries(categoryData).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}: </span>
                        <span className="text-gray-900 dark:text-white">{v}</span>
                      </div>
                    ))}
                    {cvFile && (
                      <div>
                        <span className="text-gray-500">CV: </span>
                        <span className="text-gray-900 dark:text-white">{cvFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I consent to Aethrivo collecting and processing my data for membership purposes. I agree to the terms and conditions and privacy policy.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-outline px-6 py-2.5 rounded-xl font-semibold disabled:opacity-30 flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="btn-primary px-6 py-2.5 rounded-xl font-semibold disabled:opacity-60 flex items-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!consent || submitting}
                className="btn-primary px-8 py-2.5 rounded-xl font-semibold disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
