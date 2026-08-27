import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import StatusBadge from './StatusBadge';

export default function MatchCard({ match, showClaimButton = false }) {
  const { item, score, strength, reasons } = match;

  const getStrengthBadge = () => {
    switch (strength) {
      case 'VERY_STRONG': return { status: 'APPROVED', label: 'VERY STRONG MATCH' };
      case 'STRONG': return { status: 'ACTIVE', label: 'STRONG MATCH' };
      case 'POSSIBLE': return { status: 'PENDING', label: 'POSSIBLE MATCH' };
      default: return { status: 'PENDING', label: 'MATCH' };
    }
  };

  const strengthBadge = getStrengthBadge();

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 pr-3">
          <StatusBadge status={strengthBadge.status} size="xs" className="mb-2" />
          <h3 className="font-semibold text-text text-lg truncate">{item.title}</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {item.category} · {item.location} · {formatDate(item.date)}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="font-mono text-2xl font-bold text-primary">{score}%</span>
          <p className="text-[10px] uppercase font-mono tracking-wider text-text-muted">MATCH SCORE</p>
        </div>
      </div>

      <div className="w-full bg-surface-elevated h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>

      <div className="space-y-2 mb-5">
        {reasons.map((reason) => (
          <div key={reason} className="flex items-center gap-2 text-sm text-text-secondary">
            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
            <span>{reason}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Link to={`/items/${item.id}`} className="btn-ghost text-sm flex-1 text-center">
          View Details
        </Link>
        {showClaimButton && item.type === 'FOUND' && item.status === 'ACTIVE' && (
          <Link to={`/items/${item.id}?action=claim`} className="btn-primary text-sm flex-1 text-center">
            Claim Item
          </Link>
        )}
      </div>
    </div>
  );
}
