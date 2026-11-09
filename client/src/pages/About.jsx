import { Link } from 'react-router-dom';
import {
  Handshake, BookOpen, Lightbulb, TrendingUp, Target, Eye, ArrowRight,
  Users, GraduationCap, Briefcase, Shield, Cpu, Heart, Building2
} from 'lucide-react';

const visionCards = [
  { icon: Handshake, title: 'Connect', description: 'Build direct relationships between learners, faculty, verified domain experts, and forward-looking industries.' },
  { icon: BookOpen, title: 'Learn', description: 'Master high-impact practical tools, analytics, project management, and technologies absent from standard academic syllabi.' },
  { icon: Lightbulb, title: 'Innovate', description: 'Protect intellectual breakthroughs with patent prosecution, design registrations, and bilateral institutional MoUs.' },
  { icon: TrendingUp, title: 'Grow', description: 'Accelerate career readiness, professional certifications, employability, and institutional capacity building.' },
];

const offerings = [
  { icon: Cpu, title: 'Aethrivo Skills', description: 'Searchable practical courses in Project Management, Data Analytics, Generative AI, CAD, and Full-Stack Engineering.' },
  { icon: GraduationCap, title: 'Aethrivo Academy', description: 'Tailored institutional FDP, SDP, MDP, EDP, Outcome Based Education (OBE), and academic leadership tracks.' },
  { icon: Shield, title: 'Aethrivo IPR', description: 'Comprehensive patent search, prior-art analysis, patentability, drafting assistance, and trademark protection.' },
  { icon: Briefcase, title: 'Aethrivo Corporate', description: 'Enterprise corporate training, HR transformation, Lean Six Sigma, OKR frameworks, and culture consulting.' },
  { icon: Users, title: 'Aethrivo Talent', description: 'Vetted expert directory connecting verified patent attorneys, professors, trainers, and consultants with paid assignments.' },
  { icon: Heart, title: 'Aethrivo Wellbeing', description: 'Evidence-based Organisational Happiness Index (OHI), Toxicity Index (OTI), and campus climate diagnostic assessments.' },
  { icon: Building2, title: 'MoU & Collaborations', description: 'Structuring, implementing, and tracking active bilateral partnerships between academia, industry, and startups.' },
];

export default function About() {
  return (
    <div className="font-body">
      {/* Hero */}
      <section className="gradient-hero py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6">
            One Step Towards Work Ready
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">About Aethrivo</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            The hub for an intellectual and domain expert community — bridging the gap between conventional academics and industry readiness with essential real-world skills.
          </p>
        </div>
      </section>

      {/* Mission & Purpose */}
      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Target className="w-4 h-4" /> What Aethrivo Does
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            One Step Towards Work Ready
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto mb-6">
            Aethrivo is one integrated professional ecosystem and community hub connecting students, faculty, domain experts, trainers, consultants, institutions, and industry under one roof.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Traditional academics provide foundational theoretical education, but modern employers demand hands-on tool mastery, agile execution, and cross-functional problem solving. Aethrivo delivers the missing competencies — through specialized skills courses, institutional faculty/student development, intellectual property prosecution, corporate consulting, and bilateral industry collaborations.
          </p>
        </div>
      </section>

      {/* Vision Cards */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Eye className="w-4 h-4" /> Our Vision
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold gradient-text">Our Core Pillars</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visionCards.map((card) => (
              <div key={card.title} className="card-glass rounded-2xl p-6 text-center hover:scale-[1.03] transition-transform duration-300">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-5">
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seven Core Verticals */}
      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold gradient-text mb-4">
              Seven Specialized Business Verticals
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              An integrated suite of professional services designed to equip individuals and institutions for the future of work.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((offer) => (
              <div key={offer.title} className="card-glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between">
                <div>
                  <offer.icon className="w-10 h-10 text-primary-600 mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white mb-2">{offer.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{offer.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Take Your Next Step Towards Work Ready
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Become a part of the Aethrivo ecosystem and gain the real-world skills and expert connections that accelerate your future.
          </p>
          <Link to="/membership" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors">
            Join as a Member <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
