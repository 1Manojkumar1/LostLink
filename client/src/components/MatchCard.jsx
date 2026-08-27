import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import StatusBadge from './StatusBadge';

export default function MatchCard({ match }) {
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
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
          <StatusBadge status={strengthBadge.status} size="xs" className="mb-2" />
          <h3 className="font-semibold text-text text-lg truncate">{item.title}</h3>
          <p className="text-sm text-text-secondary mt-1">
            {item.category} · {item.location} · {formatDate(item.date)}
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <span className="font-mono text-2xl font-bold text-primary">{score}%</span>
          <p className="text-xs text-text-muted">match</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {reasons.map((reason) => (
          <div key={reason} className="flex items-center gap-2 text-sm text-text-secondary">
            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
            {reason}
          </div>
        ))}
      </div>

      <Link to={`/items/${item.id}`} className="btn-ghost text-sm block text-center">
        View Item
      </Link>
    </div>
  );
}
