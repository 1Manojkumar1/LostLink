import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageX, PackageCheck, GitCompare, Shield, CheckCircle2, Clock,
  Loader2, ArrowRight, LayoutDashboard, AlertCircle
} from 'lucide-react';
import { getMyItems } from '../services/itemService';
import { getMyClaims, getIncomingClaims } from '../services/claimService';
import { getMyMatches } from '../services/matchService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import StatusBadge from '../components/StatusBadge';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    lostItems: [],
    foundItems: [],
    matches: [],
    myClaims: [],
    receivedClaims: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const [itemsRes, claimsRes, incomingRes, matchesRes] = await Promise.all([
          getMyItems(),
          getMyClaims(),
          getIncomingClaims(),
          getMyMatches().catch(() => ({ data: [] })),
        ]);

        const allItems = itemsRes.data || [];
        const lostItems = allItems.filter((i) => i.type === 'LOST');
        const foundItems = allItems.filter((i) => i.type === 'FOUND');
        const myClaims = claimsRes.data || [];
        const receivedClaims = incomingRes.data || [];
        const matches = (matchesRes.data || []).slice(0, 5);

        setData({ lostItems, foundItems, matches, myClaims, receivedClaims });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="flex items-center justify-center px-6" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <div className="card max-w-md w-full text-center">
            <LayoutDashboard className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text mb-2">Failed to Load Dashboard</h2>
            <p className="text-text-secondary mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  const totalLost = data.lostItems.length;
  const totalFound = data.foundItems.length;
  const totalMatches = data.matches.length;
  const totalRecovered = data.lostItems.filter((i) => i.status === 'RESOLVED').length + data.foundItems.filter((i) => i.status === 'RESOLVED').length;
  const pendingReceivedClaims = data.receivedClaims.filter((c) => c.status === 'PENDING');

  const allItems = [...data.lostItems, ...data.foundItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="page-container page-section">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="page-title">Dashboard</h1>
          </div>
          <p className="page-subtitle">Welcome back, {user?.name}. Here's your LostLink overview.</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Lost Reports', value: totalLost, icon: PackageX, bgClass: 'bg-error/10', textClass: 'text-error' },
            { label: 'Found Reports', value: totalFound, icon: PackageCheck, bgClass: 'bg-success/10', textClass: 'text-success' },
            { label: 'Possible Matches', value: totalMatches, icon: GitCompare, bgClass: 'bg-primary/10', textClass: 'text-primary' },
            { label: 'Recovered', value: totalRecovered, icon: CheckCircle2, bgClass: 'bg-info/10', textClass: 'text-info' },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bgClass} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.textClass}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text font-mono">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Required */}
        {pendingReceivedClaims.length > 0 && (
          <div className="mb-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-text">Action Required</p>
                  <p className="text-sm text-text-secondary">
                    {pendingReceivedClaims.length} claim{pendingReceivedClaims.length !== 1 ? 's' : ''} need your review.
                  </p>
                </div>
              </div>
              <Link to="/claims?tab=received" className="btn-primary text-sm flex items-center gap-1.5">
                Review Claims
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Reports */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">My Reports</h2>
              <Link to="/my-reports" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {allItems.length === 0 ? (
              <div className="card text-center py-8">
                <PackageX className="w-10 h-10 text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-secondary mb-3">No reports yet</p>
                <div className="flex gap-2 justify-center">
                  <Link to="/report?type=LOST" className="btn-primary text-sm">Report Lost</Link>
                  <Link to="/report?type=FOUND" className="btn-ghost text-sm">Report Found</Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {allItems.slice(0, 5).map((item) => (
                  <Link key={item.id} to={`/items/${item.id}`} className="card block card-hover">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <StatusBadge status={item.type} size="xs" />
                        <div className="min-w-0">
                          <p className="font-medium text-text truncate">{item.title}</p>
                          <p className="text-xs text-text-muted">{item.category} · {item.location}</p>
                        </div>
                      </div>
                      <StatusBadge status={item.status} size="xs" className="ml-2 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Possible Matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">Possible Matches</h2>
              <Link to="/matches" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {data.matches.length === 0 ? (
              <div className="card text-center py-8">
                <GitCompare className="w-10 h-10 text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-secondary">No matches found yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.matches.slice(0, 5).map((match, index) => (
                  <Link key={`${match.item.id}-${index}`} to={`/items/${match.item.id}`} className="card block card-hover">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-text truncate">{match.item.title}</p>
                        <p className="text-xs text-text-muted">{match.item.category} · {match.sourceItem.title}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="font-mono text-lg font-bold text-primary">{match.score}%</span>
                        <StatusBadge
                          status={match.strength === 'VERY_STRONG' ? 'APPROVED' : match.strength === 'STRONG' ? 'ACTIVE' : 'PENDING'}
                          size="xs"
                          className="ml-2"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* My Claims */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">My Claims</h2>
              <Link to="/claims" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {data.myClaims.length === 0 ? (
              <div className="card text-center py-8">
                <Shield className="w-10 h-10 text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-secondary">No claims submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.myClaims.slice(0, 5).map((claim) => (
                  <div key={claim.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-text truncate">{claim.itemId?.title || 'Removed item'}</p>
                        <p className="text-xs text-text-muted">{formatDate(claim.createdAt)}</p>
                      </div>
                      <StatusBadge status={claim.status} size="xs" className="ml-2 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Recovered */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">Recently Recovered</h2>
            </div>
            {allItems.filter((i) => i.status === 'RESOLVED').length === 0 ? (
              <div className="card text-center py-8">
                <CheckCircle2 className="w-10 h-10 text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-secondary">No recovered items yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allItems
                  .filter((i) => i.status === 'RESOLVED')
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.id} className="card">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-text truncate">{item.title}</p>
                          <p className="text-xs text-text-muted">Recovered · {formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
