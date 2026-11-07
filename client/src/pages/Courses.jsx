import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Clock, BarChart3, Monitor, Loader2, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import { coursesData } from '../data/coursesData';

const levelColors = {
  Beginner: 'bg-emerald-100 text-emerald-800',
  Intermediate: 'bg-amber-100 text-amber-800',
  Advanced: 'bg-rose-100 text-rose-800',
  'All Levels': 'bg-blue-100 text-blue-800',
};

const modeIcons = {
  Online: '🌐',
  Offline: '🏢',
  Hybrid: '🔄',
};

export default function Courses() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: serverCourses, isLoading } = useQuery({
    queryKey: ['public-courses'],
    queryFn: async () => {
      const res = await api.get('/api/public/courses');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Seamless fallback to the 20 blueprint flagship courses
  const courses = (serverCourses && serverCourses.length >= 20) ? serverCourses : coursesData;

  const categories = useMemo(() => {
    if (!courses) return [];
    return [...new Set(courses.map((c) => c.category).filter(Boolean))].sort();
  }, [courses]);

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      const matchesSearch =
        !search ||
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || c.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [courses, search, categoryFilter]);

  return (
    <div className="font-body section-padding bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/60 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Vertical 03: Aethrivo Skills Masterclasses</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Initial Flagship Course Catalogue
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            20 foundational and advanced certification tracks across Data Analytics, AI & Prompt Engineering, Project Management, Engineering CAD/FEA, Research Software, and Business Systems.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by course title, tool, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11 w-full bg-white shadow-xs"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field min-w-[220px] bg-white shadow-xs font-medium text-slate-700"
          >
            <option value="">All Categories ({courses.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              categoryFilter === ''
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Courses
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                categoryFilter === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && !courses && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
        )}

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course) => (
            <div
              key={course._id || course.slug}
              className="card-glass rounded-3xl overflow-hidden hover:shadow-2xl hover:border-primary-400/80 transition-all duration-300 group flex flex-col justify-between border border-slate-200/80 bg-white"
            >
              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200/60">
                    {course.category}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${levelColors[course.level] || 'bg-slate-100 text-slate-700'}`}>
                    {course.level || 'All Levels'}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-slate-900 mb-2.5 group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h3>

                <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {course.description}
                </p>

                {/* Key Metadata Pill Box */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/80 rounded-2xl text-xs text-slate-600 mb-6 border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                    <span>{course.duration || '4-6 Weeks'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>{modeIcons[course.mode] || '🌐'} {course.mode || 'Online'}</span>
                  </div>
                </div>

                {/* Fee & Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Indicative Fee
                    </span>
                    <span className="font-heading text-lg font-black text-slate-900">
                      {course.fee ? `₹${course.fee}` : 'Free / Subsidized'}
                    </span>
                  </div>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="btn-primary text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm group-hover:shadow-md"
                  >
                    View Syllabus <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-bold text-slate-800 mb-1">No courses found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your keyword search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
