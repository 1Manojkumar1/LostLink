import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Loader2, Package, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { getMyClaims, getIncomingClaims } from '../services/claimService';
import ClaimCard from '../components/ClaimCard';
import Navbar from '../components/Navbar';

export default function Claims() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'received' ? 'received' : 'my-claims';
  });
  const [myClaims, setMyClaims] = useState([]);
  const [itemClaims, setItemClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyClaims = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyClaims();
      setMyClaims(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomingClaims = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getIncomingClaims();
      setItemClaims(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'received') {
      setActiveTab('received');
    } else if (tabParam === 'my-claims') {
      setActiveTab('my-claims');
    }
  }, [location.search]);

  useEffect(() => {
    if (activeTab === 'my-claims') {
      fetchMyClaims();
    } else {
      fetchIncomingClaims();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'my-claims', label: 'My Claims', icon: Shield },
    { id: 'received', label: 'Claims Received', icon: Package },
  ];

  const currentClaims = activeTab === 'my-claims' ? myClaims : itemClaims;
  const pending = currentClaims.filter((c) => c.status === 'PENDING').length;
  const approved = currentClaims.filter((c) => c.status === 'APPROVED').length;
  const rejected = currentClaims.filter((c) => c.status === 'REJECTED').length;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="page-container page-section">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="page-title">Claims</h1>
          </div>
          <p className="page-subtitle">Manage item claims and ownership verification</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-surface rounded-lg border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-bg'
                  : 'text-text-secondary hover:text-text hover:bg-surface-elevated'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-xl font-bold text-text">{pending}</span>
            </div>
            <p className="text-xs text-text-muted">Pending</p>
          </div>
          <div className="card text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-xl font-bold text-text">{approved}</span>
            </div>
            <p className="text-xs text-text-muted">Approved</p>
          </div>
          <div className="card text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-error" />
              <span className="text-xl font-bold text-text">{rejected}</span>
            </div>
            <p className="text-xs text-text-muted">Rejected</p>
          </div>
        </div>

        {error && (
          <div className="card mb-6 flex items-center gap-3 border-error/30">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
            <p className="text-sm text-text-secondary flex-1">{error}</p>
            <button onClick={activeTab === 'my-claims' ? fetchMyClaims : fetchIncomingClaims} className="btn-ghost text-sm">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : activeTab === 'my-claims' ? (
          myClaims.length === 0 ? (
            <div className="card text-center py-12">
              <Shield className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <h3 className="font-semibold text-text mb-2">No Claims Yet</h3>
              <p className="text-sm text-text-secondary mb-4">
                You haven't claimed any items yet. Browse found items to submit a claim.
              </p>
              <Link to="/items?type=FOUND" className="btn-primary text-sm">Browse Found Items</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myClaims.map((claim) => (
                <ClaimCard key={claim.id} claim={claim} onUpdate={fetchMyClaims} />
              ))}
            </div>
          )
        ) : itemClaims.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h3 className="font-semibold text-text mb-2">No Claims Received</h3>
            <p className="text-sm text-text-secondary mb-4">No one has claimed your found items yet.</p>
            <Link to="/report?type=FOUND" className="btn-primary text-sm">Report Found Item</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {itemClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} showActions={true} onUpdate={fetchIncomingClaims} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
