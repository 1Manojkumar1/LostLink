import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="flex items-center justify-center px-6" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="card max-w-md w-full text-center">
          <p className="font-mono text-6xl font-bold text-primary mb-4">404</p>
          <h1 className="text-xl font-semibold text-text mb-2">Page Not Found</h1>
          <p className="text-text-secondary mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
