import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Loader2, Layers, ArrowRight, Briefcase, GraduationCap,
  Cpu, FlaskConical, Heart, Shield, Calendar, Users, Building2, CheckCircle2
} from 'lucide-react';
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

function getIcon(slug, name) {
  if (slug && iconMap[slug]) return iconMap[slug];
  const lower = (name || '').toLowerCase();
  if (lower.includes('ipr') || lower.includes('patent')) return Shield;
  if (lower.includes('academy') || lower.includes('faculty')) return GraduationCap;
  if (lower.includes('skill')) return Cpu;
  if (lower.includes('research')) return FlaskConical;
  if (lower.includes('corporate')) return Briefcase;
  if (lower.includes('conference') || lower.includes('event')) return Calendar;
  if (lower.includes('talent') || lower.includes('expert')) return Users;
  if (lower.includes('wellbeing') || lower.includes('happiness')) return Heart;
  if (lower.includes('mou') || lower.includes('collab')) return Building2;
  return Layers;
}

export default function Verticals() {
  const { data: serverVerticals, isLoading } = useQuery({
    queryKey: ['verticals'],
    queryFn: async () => {
      const res = await api.get('/api/verticals');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Always fallback gracefully to the blueprint 9 verticals so all 9 are always visible
  const verticals = (serverVerticals && serverVerticals.length >= 9) ? serverVerticals : verticalsData;

  return (
    <div className="font-body section-padding bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200/60 text-primary-700 text-xs font-bold uppercase tracking-wider mb-4">
            Aethrivo Ecosystem Architecture
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Our Nine Core Business Verticals
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            One integrated platform connecting learners, faculty, researchers, experts, institutions, and industry to skills, knowledge, consultancy, and multilateral collaboration.
          </p>
        </div>

        {/* Loading Indicator (if loading first time) */}
        {isLoading && !verticals && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
        )}

        {/* Verticals Grid - All 9 Verticals */}
        {verticals && verticals.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {verticals.map((vertical, idx) => {
              const Icon = getIcon(vertical.slug, vertical.name);
              const services = vertical.services || vertical.serviceCatalogue || [];

              return (
                <div
                  key={vertical.slug || idx}
                  className="card-glass rounded-3xl p-7 hover:shadow-2xl hover:border-primary-400/80 transition-all duration-300 group flex flex-col justify-between border border-slate-200/80 bg-white"
                >
                  <div>
                    {/* Top badge and icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 tracking-wider">
                        VERTICAL 0{vertical.order || idx + 1}
                      </span>
                    </div>

                    {/* Title & Positioning Line */}
                    <h2 className="font-heading text-2xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-1.5">
                      {vertical.name}
                    </h2>
                    <p className="text-xs font-semibold text-primary-600 mb-4 line-clamp-1">
                      {vertical.positioningLine}
                    </p>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {vertical.description}
                    </p>

                    {/* Service highlights (top 3) */}
                    {services.length > 0 && (
                      <div className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Key Service Highlights:
                        </p>
                        {services.slice(0, 3).map((item, i) => {
                          const label = typeof item === 'string' ? item : item.name || item.title;
                          return (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <Link
                      to={`/verticals/${vertical.slug}`}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-primary-600 hover:text-white hover:bg-primary-600 border border-primary-200 hover:border-primary-600 transition-all flex items-center justify-center gap-1.5 group-hover:shadow-md"
                    >
                      View Catalogue & Enquire <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
