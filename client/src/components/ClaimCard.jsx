import { Link } from 'react-router-dom';
import { Package, MapPin, Loader2, CheckCircle2, XCircle, MessageCircle, Mail } from 'lucide-react';
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
      setError(err.message || 'Failed to approve claim');
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
      setError(err.message || 'Failed to reject claim');
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

  const contactPerson = showActions ? claim.claimantId : claim.itemId.userId;


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

      {claim.status === 'APPROVED' && (
        <div className="mt-3 p-3.5 bg-success/10 border border-success/20 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-success font-medium text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Claim Approved — Campus Safe Handover Active</span>
          </div>
          {contactPerson && (
            <div className="text-xs text-text-secondary">
              <p className="mb-2">
                Contact: <strong className="text-text">{contactPerson.name}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {contactPerson.phone && (
                  <a
                    href={`https://wa.me/${contactPerson.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white rounded-md font-medium hover:bg-[#20bd5a] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${contactPerson.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated border border-border text-text rounded-md font-medium hover:bg-bg transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </a>
              </div>
            </div>
          )}
          <div className="pt-1 border-t border-success/20">
            <p className="text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-wider">
              Recommended Campus Safe Pickup Spots:
            </p>
            <ul className="text-xs text-text-secondary space-y-0.5 list-disc list-inside">
              <li>Main Library Entrance Help Desk</li>
              <li>Campus Security Gate 1 Security Booth</li>
              <li>Student Union / Affairs Center</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
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
