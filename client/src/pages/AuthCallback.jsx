import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    const handleAuth = async () => {
      if (error) {
        navigate('/login', { replace: true });
        return;
      }

      if (token) {
        try {
          await loginWithToken(token);
          navigate('/', { replace: true });
        } catch {
          navigate('/login', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    handleAuth();
  }, [token, error, navigate, loginWithToken]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <Logo size="lg" className="justify-center" />
        </div>

        <div className="card">
          <div className="py-12">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary mb-4" />
            <h2 className="text-lg font-semibold text-text mb-2">Completing sign in...</h2>
            <p className="text-sm text-text-secondary">Please wait while we verify your account</p>
          </div>
        </div>
      </div>
    </div>
  );
}