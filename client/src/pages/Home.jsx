import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageX, PackageCheck, Search, ShieldCheck, GitCompare, CheckCircle2 } from 'lucide-react';
import { checkHealth } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';

function StatusDot({ status }) {
  const colors = {
    connected: 'bg-success',
    disconnected: 'bg-error',
    checking: 'bg-warning',
    error: 'bg-error',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-text-muted'}`} />;
}

function StatusLabel({ status }) {
  const labels = {
    connected: 'Connected',
    disconnected: 'Disconnected',
    checking: 'Checking...',
    error: 'Error',
  };
  return <span className="text-sm text-text-secondary">{labels[status] || 'Unknown'}</span>;
}

export default function Home() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [dbStatus, setDbStatus] = useState('checking');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await checkHealth();
        setApiStatus(res.success ? 'connected' : 'error');
        setDbStatus(res.database === 'connected' ? 'connected' : 'disconnected');
      } catch {
        setApiStatus('disconnected');
        setDbStatus('disconnected');
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero Section */}
      <main className="page-container">
        <section className="page-section">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text leading-tight tracking-tight mb-5">
              Lost something?<br />
              <span className="text-primary">Find it faster.</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-lg">
              LostLink connects lost and found reports across your campus using smart matching
              and secure ownership verification.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/report?type=LOST" className="btn-primary flex items-center gap-2">
                <PackageX className="w-4 h-4" />
                Report Lost Item
              </Link>
              <Link to="/report?type=FOUND" className="btn-primary flex items-center gap-2">
                <PackageCheck className="w-4 h-4" />
                Report Found Item
              </Link>
              <Link to="/items" className="btn-ghost flex items-center gap-2">
                <Search className="w-4 h-4" />
                Browse Reports
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="page-section border-t border-border">
          <h2 className="section-title mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: '01', icon: PackageX, title: 'Report', desc: 'Post a lost or found item with details.' },
              { step: '02', icon: Search, title: 'Discover', desc: 'Search and filter relevant reports.' },
              { step: '03', icon: GitCompare, title: 'Match', desc: 'Smart matching compares category, location, date, and description.' },
              { step: '04', icon: ShieldCheck, title: 'Verify', desc: 'Ownership is confirmed before recovery.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-text-muted">{item.step}</span>
                  <item.icon className="w-5 h-5 text-text-secondary" />
                </div>
                <h3 className="font-semibold text-text mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* System Status */}
        <section className="page-section border-t border-border">
          <h2 className="section-title mb-6">System Status</h2>
          <div className="card max-w-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">API</span>
                <div className="flex items-center gap-2">
                  <StatusDot status={apiStatus} />
                  <StatusLabel status={apiStatus} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Database</span>
                <div className="flex items-center gap-2">
                  <StatusDot status={dbStatus} />
                  <StatusLabel status={dbStatus} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Match Preview */}
        <section className="page-section border-t border-border">
          <h2 className="section-title mb-8">Smart Matching</h2>
          <div className="card max-w-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="badge bg-primary/15 text-primary mb-2">POSSIBLE MATCH</span>
                <h3 className="font-semibold text-text text-lg">Black HP Laptop</h3>
                <p className="text-sm text-text-secondary mt-1">Electronics · Central Library · Aug 26</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-bold text-primary">94%</span>
                <p className="text-xs text-text-muted">match</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {['Same category', 'Similar location', 'Similar description', 'Same date'].map((reason) => (
                <div key={reason} className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  {reason}
                </div>
              ))}
            </div>
            <Link to="/items" className="btn-ghost text-sm block text-center">
              Browse Items
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="page-container py-8">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <p className="text-xs text-text-muted">Smart Campus Lost & Found</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
