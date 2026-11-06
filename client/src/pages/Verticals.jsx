import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Layers, ArrowRight, BookOpen, Briefcase, Lightbulb, GraduationCap, Cpu, FlaskConical, Globe, Heart, Shield } from 'lucide-react';
import api from '../lib/api';

const iconMap = {
  education: GraduationCap,
  technology: Cpu,
  business: Briefcase,
  research: FlaskConical,
  innovation: Lightbulb,
  health: Heart,
  global: Globe,
  security: Shield,
  learning: BookOpen,
};

function getIcon(name) {
  if (!name) return Layers;
  const lower = name.toLowerCase();
  for (const [key, Icon] of Object.entries(iconMap)) {
    if (lower.includes(key)) return Icon;
  }
  return Layers;
}

export default function Verticals() {
  const { data: verticals, isLoading } = useQuery({
    queryKey: ['verticals'],
    queryFn: async () => {
      const res = await api.get('/api/verticals');
      return res.data.data;
    },
  });

  return (
    <div className="font-body section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text mb-4">Our Verticals</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our diverse service verticals that bridge the gap between academia, industry, and innovation to create holistic growth ecosystems.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
        )}

        {/* Verticals Grid */}
        {!isLoading && verticals && verticals.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {verticals.map((vertical) => {
              const Icon = getIcon(vertical.name);
              return (
                <Link
                  key={vertical.slug}
                  to={`/verticals/${vertical.slug}`}
                  className="card-glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 group flex flex-col"
                >
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                    {vertical.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {vertical.description}
                  </p>
                  <span className="text-primary-600 font-medium text-sm inline-flex items-center gap-1 mt-auto">
                    Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading && (!verticals || verticals.length === 0) && (
          <div className="text-center py-20">
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No verticals available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
