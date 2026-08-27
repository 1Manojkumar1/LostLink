import { Link } from 'react-router-dom';
import { Package, MapPin, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { approveClaim, rejectClaim } from '../services/claimService';
import { useState } from 'react';
import { formatDate } from '../utils/formatDate';
import StatusBadge from './StatusBadge';

export default function ClaimCard({ claim, onUpdate, showActions = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    setLoading(true);
    setError('');
    try {
      await approveClaim(claim.id);
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve claim');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setError('');
    try {
      await rejectClaim(claim.id);
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject claim');
    } finally {
      setLoading(false);
    }
  };

  if (!claim.itemId) {
    return (
      <div className="card">
        <p className="text-text-secondary text-sm">This item has been removed.</p>
        <StatusBadge status={claim.status} size="xs" className="mt-2" />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 bg-surface-elevated rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {claim.itemId.image ? (
              <img src={claim.itemId.image} alt={claim.itemId.title} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-5 h-5 text-text-muted" />
            )}
          </div>
          <div className="min-w-0">
            <Link to={`/items/${claim.itemId.id}`} className="font-medium text-text hover:text-primary transition-colors">
              {claim.itemId.title}
            </Link>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
              <span>{claim.itemId.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {claim.itemId.location}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={claim.status} size="xs" className="flex-shrink-0 ml-2" />
      </div>

      {showActions && claim.claimantId && (
        <div className="mb-3 p-3 bg-surface-elevated rounded-lg">
          <p className="text-xs text-text-muted mb-1">Claimed by</p>
          <p className="text-sm font-medium text-text">{claim.claimantId.name}</p>
          <p className="text-xs text-text-secondary">{claim.claimantId.email}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">{formatDate(claim.createdAt)}</span>

        {showActions && claim.status === 'PENDING' && (
          <div className="flex gap-2">
            <button onClick={handleReject} className="btn-ghost text-sm flex items-center gap-1.5" disabled={loading}>
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
              Reject
            </button>
            <button onClick={handleApprove} className="btn-primary text-sm flex items-center gap-1.5" disabled={loading}>
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Approve
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-error mt-2">{error}</p>}
    </div>
  );
}
