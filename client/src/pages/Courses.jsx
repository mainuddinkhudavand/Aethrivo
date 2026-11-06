import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Clock, BarChart3, Monitor, Loader2 } from 'lucide-react';
import api from '../lib/api';

const levelColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

const modeIcons = {
  Online: '🌐',
  Offline: '🏢',
  Hybrid: '🔄',
};

export default function Courses() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['public-courses'],
    queryFn: async () => {
      const res = await api.get('/api/public/courses');
      return res.data.data;
    },
  });

  const categories = useMemo(() => {
    if (!courses) return [];
    return [...new Set(courses.map((c) => c.category).filter(Boolean))];
  }, [courses]);

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      const matchesSearch =
        !search ||
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || c.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [courses, search, categoryFilter]);

  return (
    <div className="font-body section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text mb-4">Our Courses</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our comprehensive range of courses designed to equip you with cutting-edge skills.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field min-w-[200px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
        )}

        {/* Course Grid */}
        {!isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <Link
                key={course._id || course.slug}
                to={`/courses/${course.slug}`}
                className="card-glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {course.category && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-100 text-primary-700">
                        {course.category}
                      </span>
                    )}
                    {course.level && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColors[course.level] || 'bg-gray-100 text-gray-700'}`}>
                        {course.level}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {course.shortDescription || course.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    {course.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {course.duration}
                      </span>
                    )}
                    {course.mode && (
                      <span className="flex items-center gap-1">
                        <Monitor className="w-3.5 h-3.5" /> {modeIcons[course.mode] || ''} {course.mode}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
