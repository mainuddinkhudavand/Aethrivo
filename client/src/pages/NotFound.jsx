import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="font-body min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-8xl md:text-9xl font-bold gradient-text mb-4">404</h1>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg"
        >
          <Home className="w-5 h-5" /> Go Home
        </Link>
      </div>
    </div>
  );
}
