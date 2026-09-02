import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      setError(errorParam === 'google_auth_failed'
        ? 'Google sign-in failed. Please try again.'
        : 'An error occurred. Please try again.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Logo size="lg" className="justify-center" />
        </div>

        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-text mb-1">Welcome to LostLink</h1>
            <p className="text-sm text-text-secondary">Sign in to your campus account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg" role="alert">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <GoogleSignInButton loading={loading} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-secondary">Or continue with email</span>
              </div>
            </div>

            <Link
              to="/register"
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              <span className="font-medium">Create account with email</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}