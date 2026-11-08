import { Link } from 'react-router-dom';
import { Handshake, BookOpen, Lightbulb, TrendingUp, Target, Eye, ArrowRight, Users, Calendar, GraduationCap, Briefcase } from 'lucide-react';

const visionCards = [
  { icon: Handshake, title: 'Connect', description: 'Build meaningful connections between academia, industry, and research through our integrated platform.' },
  { icon: BookOpen, title: 'Learn', description: 'Access cutting-edge courses, workshops, and resources designed by industry experts and academicians.' },
  { icon: Lightbulb, title: 'Innovate', description: 'Foster innovation through collaborative projects, hackathons, and cross-disciplinary initiatives.' },
  { icon: TrendingUp, title: 'Grow', description: 'Accelerate personal and professional growth with mentorship, certifications, and career opportunities.' },
];

const offerings = [
  { icon: GraduationCap, title: 'Courses & Certifications', description: 'Industry-relevant courses with recognized certifications.' },
  { icon: Calendar, title: 'Events & Conferences', description: 'Workshops, webinars, and conferences on trending topics.' },
  { icon: Users, title: 'Expert Network', description: 'Access to a diverse network of trainers, consultants, and mentors.' },
  { icon: Briefcase, title: 'Industry Partnerships', description: 'Collaborations with leading organizations and startups.' },
  { icon: Lightbulb, title: 'Innovation Labs', description: 'Spaces for experimentation, prototyping, and research.' },
  { icon: Target, title: 'Career Services', description: 'Placement support, internships, and skill assessments.' },
];

export default function About() {
  return (
    <div className="font-body">
      {/* Hero */}
      <section className="gradient-hero py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">About Aethrivo</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Empowering the next generation of learners, innovators, and leaders through a comprehensive ecosystem of education, research, and industry collaboration.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Target className="w-4 h-4" /> Our Mission
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Bridging Academia, Industry, and Innovation
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            Aethrivo is a transformative platform that connects students, faculty, researchers, entrepreneurs, and industry professionals
            under one roof. We believe in creating synergies that drive meaningful progress — from skill development and research
            to entrepreneurship and social impact.
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
                <p className="text-gray-600 dark:text-gray-400 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold gradient-text mb-4">What We Offer</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive suite of services designed to support every stage of your professional journey.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((offer) => (
              <div key={offer.title} className="card-glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
                <offer.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white mb-2">{offer.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{offer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Become a part of the Aethrivo ecosystem and unlock endless possibilities for growth and collaboration.
          </p>
          <Link to="/membership" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors">
            Join as a Member <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
