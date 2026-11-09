import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Users, BookOpen, Calendar, Layers, ArrowRight, ChevronRight,
  Shield, Cpu, GraduationCap, FlaskConical, Lightbulb, FileText,
  CheckCircle2, Star, Sparkles, TrendingUp, Award, Clock, ArrowUpRight,
  Heart, Building2, Briefcase
} from 'lucide-react';
import api from '../lib/api';
import { verticalsData } from '../data/verticalsData';
import { coursesData } from '../data/coursesData';

const verticalIcons = {
  ipr: Shield,
  academy: GraduationCap,
  skills: Cpu,
  corporate: Briefcase,
  talent: Users,
  wellbeing: Heart,
  'mou-collaborations': Building2,
};

const stats = [
  { icon: Users, label: 'Active Members', value: '500+', change: '+24% this month' },
  { icon: BookOpen, label: 'Flagship Courses', value: '20+', change: 'Updated weekly' },
  { icon: Award, label: 'Domain Experts', value: '50+', change: 'Verified specialists' },
  { icon: Layers, label: 'Core Verticals', value: '7', change: 'End-to-end integration' },
];

const pillars = [
  {
    icon: Cpu,
    title: 'Work-Ready Industry Skills',
    description: 'Master practical tools in project management, data analytics, generative AI, CAD engineering, and software missing from regular college curricula.',
  },
  {
    icon: Shield,
    title: 'Intellectual Property Protection',
    description: 'Protect innovations with prior-art search, patentability assessment, drafting assistance, and trademark filings guided by verified practitioners.',
  },
  {
    icon: GraduationCap,
    title: 'Institutional Development',
    description: 'Empower higher education through Faculty Development Programmes (FDP), Student Development (SDP), Outcome-Based Education (OBE), and leadership training.',
  },
  {
    icon: Building2,
    title: 'MoUs & Industry Partnerships',
    description: 'Form structured, active bilateral partnerships between colleges, universities, startups, MSMEs, and global technology enterprises.',
  },
];

const testimonials = [
  {
    quote: 'Aethrivo guided our deep-tech team through our first international patent filing in record time with zero office action delays.',
    author: 'Dr. Ramesh Sundar',
    role: 'Head of Robotics Research, Tech University',
    rating: 5,
  },
  {
    quote: 'The AI & LLM Architecture masterclass was the most practical enterprise-focused training our engineering team has experienced.',
    author: 'Sneha Patel',
    role: 'VP of Engineering, CloudScale Systems',
    rating: 5,
  },
  {
    quote: 'Through the incubation vertical, we connected directly with angel investors and secured our initial institutional seed round.',
    author: 'Aditya Roy',
    role: 'Founder & CEO, NeuroVision AI',
    rating: 5,
  },
];

export default function Home() {
  const { data: verticals } = useQuery({
    queryKey: ['verticals'],
    queryFn: async () => {
      const res = await api.get('/verticals');
      return res.data.data;
    },
  });

  const { data: courses } = useQuery({
    queryKey: ['home-courses'],
    queryFn: async () => {
      const res = await api.get('/public/courses');
      return res.data.data;
    },
  });

  const { data: events } = useQuery({
    queryKey: ['home-events'],
    queryFn: async () => {
      const res = await api.get('/public/events');
      return res.data.data;
    },
  });

  const { data: experts } = useQuery({
    queryKey: ['home-experts'],
    queryFn: async () => {
      const res = await api.get('/public/experts');
      return res.data.data;
    },
  });

  const topVerticals = (verticals && verticals.length >= 7) ? verticals : verticalsData;
  const topCourses = (courses && courses.length >= 3) ? courses.slice(0, 6) : coursesData.slice(0, 6);
  const topEvents = events?.slice(0, 3) ?? [];
  const topExperts = experts?.slice(0, 4) ?? [];

  return (
    <div className="font-body bg-slate-50 text-slate-900 selection:bg-primary-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        {/* Animated Background Mesh & Lights */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '7s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/25 rounded-full blur-[160px]" />
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          {/* Announcement Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-cyan-300 mb-8 hover:bg-white/15 transition-all">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>One Step Towards Work Ready • Community of Intellectual & Domain Experts</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <Link to="/membership" className="text-white hover:underline flex items-center gap-1 font-semibold">
              Join Free Today <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Main Hero Heading */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            <span className="block text-white">ONE STEP TOWARDS</span>
            <span className="bg-gradient-to-r from-primary-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              WORK READY
            </span>
          </h1>

          {/* Tagline & Subtitle */}
          <p className="font-heading text-xl sm:text-2xl md:text-3xl text-primary-200 font-semibold tracking-widest uppercase mb-6">
            CONNECT. LEARN. INNOVATE. GROW.
          </p>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-10">
            Aethrivo is the hub for an intellectual and domain expert community — empowering students, faculty, and professionals to become industry-ready with high-impact practical skills missing from regular academics.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/membership"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 shadow-lg shadow-primary-500/30 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base"
            >
              Become a Member <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/courses"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-200 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-2 text-base"
            >
              Explore Skill Courses <BookOpen className="w-5 h-5" />
            </Link>
            <Link
              to="/verticals"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-base"
            >
              Seven Verticals <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Floating Live Feature Snippets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-cyan-300 font-semibold uppercase tracking-wider">Patent Lifecycle</p>
                <p className="text-sm font-medium text-white">Prior Art & Global Drafting</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-300 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-primary-300 font-semibold uppercase tracking-wider">AI Engineering</p>
                <p className="text-sm font-medium text-white">LLMs, RAG & Autonomous Agents</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-violet-300 font-semibold uppercase tracking-wider">Verified Experts</p>
                <p className="text-sm font-medium text-white">Advisory & 1-on-1 Mentorship</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
                <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="font-heading text-3xl sm:text-4xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> {s.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Verticals Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider mb-3">
              Specialized Ecosystem
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Seven Dedicated Verticals of Excellence
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-2xl">
              Connecting learners, faculty, domain experts, institutions and industry across seven high-impact professional domains.
            </p>
          </div>
          <Link
            to="/verticals"
            className="btn-outline self-start md:self-auto flex items-center gap-2 whitespace-nowrap"
          >
            All Verticals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topVerticals.map((vert) => {
            const IconComponent = verticalIcons[vert.slug] || Layers;
            return (
              <div
                key={vert._id || vert.slug}
                className="group relative bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary-400 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 text-white flex items-center justify-center mb-6 shadow-md shadow-primary-500/20 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2">
                    {vert.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary-600 mb-4">{vert.positioningLine}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {vert.description}
                  </p>

                  {/* Services snippet */}
                  {vert.services && vert.services.length > 0 && (
                    <div className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                      {vert.services.slice(0, 3).map((srv, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{srv}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/verticals/${vert.slug}`}
                    className="text-sm font-bold text-primary-600 group-hover:text-primary-700 flex items-center gap-1.5"
                  >
                    View Details & Submit Inquiry <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Courses / Masterclasses */}
      <section className="py-24 bg-gradient-to-b from-slate-100 to-white px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3">
                Executive Upskilling
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                High-Impact Masterclasses
              </h2>
              <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-2xl">
                Rigorous curriculum taught by registered patent attorneys, AI researchers, and venture founders.
              </p>
            </div>
            <Link to="/courses" className="btn-secondary self-start md:self-auto flex items-center gap-2">
              Browse All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topCourses.map((c) => (
              <div
                key={c._id || c.slug}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                      {c.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase">{c.mode}</span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-slate-900 mb-3 hover:text-primary-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-6 line-clamp-2">{c.description}</p>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span>{c.duration || '6 Weeks'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-500" />
                      <span>{c.level || 'Intermediate'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Program Fee</span>
                    <span className="font-heading text-xl font-bold text-slate-900">
                      {c.fee ? `₹${c.fee}` : 'Free'}
                    </span>
                  </div>
                  <Link
                    to={`/courses/${c.slug}`}
                    className="btn-primary text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1"
                  >
                    View Syllabus <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Events & Conferences */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold uppercase tracking-wider mb-3">
              Conferences & Summits
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Upcoming Flagship Gatherings
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-2xl">
              Connect with institutional stakeholders, international patent attorneys, and deep-tech pioneers.
            </p>
          </div>
          <Link to="/events" className="btn-outline self-start md:self-auto flex items-center gap-2">
            Full Events Calendar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topEvents.map((ev) => (
            <div
              key={ev._id || ev.slug}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {ev.type}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">Registration Open</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{ev.description}</p>
                <div className="space-y-2 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl">
                  <p className="flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4 text-primary-600" />
                    {ev.startDate ? new Date(ev.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'TBD'}
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <span className="w-4 text-center font-bold text-slate-400">📍</span>
                    <span className="truncate">{ev.venue || 'Virtual'}</span>
                  </p>
                </div>
              </div>
              <Link
                to={`/events/${ev.slug}`}
                className="w-full btn-outline text-xs text-center py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5"
              >
                Register for Event <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Experts Directory Teaser */}
      <section className="py-24 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Verified Mentors & Consultants
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Direct Access to Top Industry Minds
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-3">
              Book specialized advisory sessions with verified practitioners across IP law, AI, venture financing, and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {topExperts.map((exp, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4">
                    {exp.fullName?.charAt(0) || exp.name?.charAt(0) || 'E'}
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">
                    {exp.fullName || exp.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Specialist
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {exp.bio}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                  {(exp.expertiseTags || exp.domains || []).slice(0, 2).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-cyan-200 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/experts"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold rounded-xl"
            >
              Search Full Expert Directory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider inline-block mb-3">
            Institutional Rigor
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Why Universities & Enterprises Partner with Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-6">
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-100/70 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Trusted by Innovators & Institutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="font-bold text-slate-900 text-sm">{t.author}</p>
                  <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Conversion Membership CTA Banner */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-700 via-indigo-700 to-violet-800 text-white p-8 sm:p-14 lg:p-20 shadow-2xl shadow-primary-900/30">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider inline-block mb-4">
              One Step Towards Work Ready
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
              Empower Yourself with Industry-Ready Skills
            </h2>
            <p className="text-primary-100 text-base sm:text-lg mb-8 leading-relaxed">
              Whether you are a student preparing for your career, a faculty member advancing curriculum impact, or an enterprise seeking verified domain experts,
              Aethrivo equips you with real-world competencies missing from regular academics.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/membership"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white text-primary-700 hover:bg-slate-100 shadow-xl transition-all flex items-center justify-center gap-2 text-base"
              >
                Start Free Registration <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2 text-base"
              >
                Read Mission Statement <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
