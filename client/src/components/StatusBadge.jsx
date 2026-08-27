import { CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';

const statusConfig = {
  LOST: {
    bg: 'bg-error/15',
    text: 'text-error',
    icon: AlertTriangle,
  },
  FOUND: {
    bg: 'bg-success/15',
    text: 'text-success',
    icon: CheckCircle2,
  },
  ACTIVE: {
    bg: 'bg-warning/15',
    text: 'text-warning',
    icon: Clock,
  },
  CLAIM_PENDING: {
    bg: 'bg-info/15',
    text: 'text-info',
    icon: Clock,
  },
  RESOLVED: {
    bg: 'bg-success/15',
    text: 'text-success',
    icon: CheckCircle2,
  },
  PENDING: {
    bg: 'bg-warning/15',
    text: 'text-warning',
    icon: Clock,
  },
  APPROVED: {
    bg: 'bg-success/15',
    text: 'text-success',
    icon: CheckCircle2,
  },
  REJECTED: {
    bg: 'bg-error/15',
    text: 'text-error',
    icon: XCircle,
  },
};

export default function StatusBadge({ status, size = 'sm', showIcon = true, className = '' }) {
  const config = statusConfig[status];
  if (!config) return <span className="badge bg-surface-elevated text-text-muted">{status}</span>;

  const Icon = config.icon;
  const iconSize = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-[11px]';

  return (
    <span className={`badge ${config.bg} ${config.text} ${textSize} ${className}`}>
      {showIcon && <Icon className={iconSize} />}
      {status}
    </span>
  );
}
