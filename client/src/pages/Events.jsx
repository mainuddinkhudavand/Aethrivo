import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, MapPin, Loader2, Tag, Calendar } from 'lucide-react';
import api from '../lib/api';

const typeBadgeColors = {
  Conference: 'bg-purple-100 text-purple-700',
  Workshop: 'bg-blue-100 text-blue-700',
  Webinar: 'bg-cyan-100 text-cyan-700',
  Seminar: 'bg-indigo-100 text-indigo-700',
  Hackathon: 'bg-orange-100 text-orange-700',
  Meetup: 'bg-green-100 text-green-700',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Events() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      const res = await api.get('/api/public/events');
      return res.data.data;
    },
  });

  return (
    <div className="font-body section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text mb-4">Upcoming Events</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with our latest conferences, workshops, webinars, and more.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && events && events.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event._id || event.slug}
                to={`/events/${event.slug}`}
                className="card-glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {event.type && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeBadgeColors[event.type] || 'bg-gray-100 text-gray-700'}`}>
                        {event.type}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {event.description}
                  </p>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      <span>
                        {formatDate(event.startDate)}
                        {event.endDate && event.endDate !== event.startDate && ` — ${formatDate(event.endDate)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      <span>{event.venue || 'Online'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && (!events || events.length === 0) && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No upcoming events at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
