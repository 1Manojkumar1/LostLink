import { CheckCircle2, Clock, ShieldCheck, Sparkles, HandHeart } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

export default function RecoveryTimeline({ item }) {
  if (!item) return null;

  const isResolved = item.status === 'RESOLVED';
  const isClaimPending = item.status === 'CLAIM_PENDING';
  const isApproved = isResolved; // in schema, approved claim marks item as RESOLVED

  const steps = [
    {
      id: 1,
      title: item.type === 'LOST' ? 'Reported Lost' : 'Reported Found',
      description: `Reported on ${formatDate(item.createdAt || item.date)}`,
      icon: Clock,
      status: 'completed',
    },
    {
      id: 2,
      title: 'Smart Matching Active',
      description: 'LostLink scans campus database 24/7',
      icon: Sparkles,
      status: 'completed',
    },
    {
      id: 3,
      title: item.type === 'LOST' ? 'Handover Initiated' : 'Claim Verification',
      description: isClaimPending || isResolved
        ? (item.type === 'LOST' ? 'Finder submitted handover notice' : 'Claim submitted & under review')
        : (item.type === 'LOST' ? 'Awaiting finder notice' : 'Awaiting owner claim'),
      icon: ShieldCheck,
      status: (isClaimPending || isResolved) ? 'completed' : 'pending',
    },
    {
      id: 4,
      title: 'Safe Pickup & Handover Passcode',
      description: isResolved
        ? 'Passcode verified at campus pickup spot'
        : 'Meet at official campus safe spot & verify 4-digit handover passcode',
      icon: HandHeart,
      status: isResolved ? 'completed' : 'pending',
    },
    {
      id: 5,
      title: 'Reunited & Community Gratitude 🎉',
      description: isResolved ? 'Item successfully returned! Contact info sealed.' : 'Marked resolved upon successful exchange',
      icon: CheckCircle2,
      status: isResolved ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="p-4 bg-surface rounded-xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text">Recovery Progress Tracker</h3>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
          isResolved
            ? 'bg-success/15 text-success'
            : isClaimPending
            ? 'bg-warning/15 text-warning'
            : 'bg-primary/15 text-primary'
        }`}>
          {isResolved ? 'Recovered' : isClaimPending ? 'Claim Under Review' : 'Active Search'}
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-border">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative group">
              <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                isDone
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                  : 'bg-surface text-text-muted border-border'
              }`}>
                <Icon className="w-3 h-3" />
              </div>
              <div>
                <h4 className={`text-xs font-semibold ${isDone ? 'text-text' : 'text-text-muted'}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
