import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PackageX, PackageCheck, Search, ShieldCheck, GitCompare,
  CheckCircle2, ArrowRight, FolderOpen, HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/items');
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="page-container page-section">
          <div className="max-w-2xl">
            <p className="section-title mb-4">Campus Lost & Found</p>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-text leading-tight tracking-tight mb-5">
              Find what you lost.<br />
              Return what you found.
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-lg">
              LostLink connects lost and found reports across your campus using smart matching
              and secure ownership verification.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/report?type=LOST" className="btn-primary flex items-center gap-2">
                <PackageX className="w-4 h-4" />
                Report Lost Item
              </Link>
              <Link to="/report?type=FOUND" className="btn-ghost flex items-center gap-2">
                <PackageCheck className="w-4 h-4" />
                Report Found Item
              </Link>
            </div>

            <form onSubmit={handleSearch} className="max-w-lg">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lost or found items..."
                  className="input pl-10 pr-4"
                />
              </div>
            </form>
          </div>
        </section>

        {/* Product Preview */}
        <section className="page-container page-section border-t border-border">
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

        {/* Flow */}
        <section className="page-container page-section border-t border-border">
          <h2 className="section-title mb-8">How It Works</h2>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {[
              { step: '01', label: 'Report', icon: PackageX },
              { step: '02', label: 'Search', icon: Search },
              { step: '03', label: 'Match', icon: GitCompare },
              { step: '04', label: 'Verify', icon: ShieldCheck },
              { step: '05', label: 'Recover', icon: CheckCircle2 },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center border border-border">
                    <item.icon className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-xs text-text-muted block">{item.step}</span>
                    <span className="text-sm font-medium text-text">{item.label}</span>
                  </div>
                </div>
                {i < 4 && (
                  <ArrowRight className="w-4 h-4 text-text-disabled hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Problems */}
        <section className="page-container page-section border-t border-border">
          <h2 className="section-title mb-8">The Problem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: FolderOpen,
                title: 'Scattered Reports',
                desc: 'Lost information is spread across messages, groups, and notice boards.',
              },
              {
                icon: Search,
                title: 'Manual Search',
                desc: 'Students waste time checking multiple places for a single item.',
              },
              {
                icon: HelpCircle,
                title: 'Uncertain Claims',
                desc: 'Finding an item does not always prove ownership.',
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col">
                <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center border border-border mb-4">
                  <item.icon className="w-5 h-5 text-text-secondary" />
                </div>
                <h3 className="font-semibold text-text mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Solution */}
        <section className="page-container page-section border-t border-border">
          <h2 className="section-title mb-8">The Solution</h2>
          <div className="max-w-2xl mb-8">
            <p className="text-text-secondary text-lg leading-relaxed">
              One place to report. One system to match. One secure way to recover.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Report', desc: 'Post a lost or found item with details.', icon: PackageX },
              { step: '02', title: 'Discover', desc: 'Search and filter relevant reports.', icon: Search },
              { step: '03', title: 'Match', desc: 'Smart matching compares category, location, date, and description.', icon: GitCompare },
              { step: '04', title: 'Verify', desc: 'Ownership is confirmed before recovery.', icon: ShieldCheck },
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

        {/* Final CTA */}
        <section className="page-container page-section border-t border-border">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold text-text mb-3">Lost something? Start here.</h2>
            <p className="text-text-secondary mb-6">
              Report your lost item or browse found items to see if someone has already found it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/report?type=LOST" className="btn-primary flex items-center gap-2">
                <PackageX className="w-4 h-4" />
                Report Lost Item
              </Link>
              <Link to="/report?type=FOUND" className="btn-ghost flex items-center gap-2">
                <PackageCheck className="w-4 h-4" />
                Report Found Item
              </Link>
            </div>
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
