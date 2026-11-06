import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Home } from 'lucide-react';
import api from '../lib/api';

export default function VerifyEmail() {
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    api
      .get(`/api/members/verify-email?token=${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data?.message || 'Email verified successfully! Your membership is under review.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
      });
  }, [location.search]);

  return (
    <div className="font-body min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="card-glass rounded-2xl p-10">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-6" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifying Your Email</h2>
              <p className="text-gray-500">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Email Verified!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
              <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
                <Home className="w-5 h-5" /> Go to Home
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Verification Failed</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
              <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
                <Home className="w-5 h-5" /> Go to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
