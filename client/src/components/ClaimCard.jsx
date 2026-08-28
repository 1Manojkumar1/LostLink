import { Link } from 'react-router-dom';
import {
  Package, MapPin, Loader2, CheckCircle2, XCircle, MessageCircle, Mail,
  KeyRound, Heart, Sparkles, ShieldCheck, Lock, Award
} from 'lucide-react';
import { approveClaim, rejectClaim, completeHandover, sendThankYou } from '../services/claimService';
import { useState } from 'react';
import { formatDate } from '../utils/formatDate';
import StatusBadge from './StatusBadge';

export default function ClaimCard({ claim, onUpdate, showActions = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [handoverInputCode, setHandoverInputCode] = useState('');
  const [thankYouText, setThankYouText] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('🏅 Campus Good Samaritan');
  const [showThankYouForm, setShowThankYouForm] = useState(false);

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

  const handleCompleteHandover = async (codeToSubmit = '') => {
    setLoading(true);
    setError('');
    try {
      await completeHandover(claim.id, codeToSubmit);
      onUpdate();
    } catch (err) {
      setError(err.message || 'Failed to verify handover code');
    } finally {
      setLoading(false);
    }
  };

  const handleSendGratitude = async (e) => {
    e.preventDefault();
    if (!thankYouText.trim()) return;
    setLoading(true);
    setError('');
    try {
      await sendThankYou(claim.id, { note: thankYouText.trim(), badge: selectedBadge });
      setShowThankYouForm(false);
      onUpdate();
    } catch (err) {
      setError(err.message || 'Failed to send gratitude');
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

  const isHandedOver = claim.status === 'HANDED_OVER';
  const isApproved = claim.status === 'APPROVED';
  const contactPerson = showActions ? claim.claimantId : claim.itemId.userId;

  return (
    <div className="card transition-all">
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
        <StatusBadge status={isHandedOver ? 'RESOLVED' : claim.status} size="xs" className="flex-shrink-0 ml-2" />
      </div>

      {showActions && claim.claimantId && !isHandedOver && (
        <div className="mb-3 p-3 bg-surface-elevated rounded-lg">
          <p className="text-xs text-text-muted mb-1">Claimed by</p>
          <p className="text-sm font-medium text-text">{claim.claimantId.name}</p>
          <p className="text-xs text-text-secondary">{claim.claimantId.email}</p>
        </div>
      )}

      {/* APPROVED ACTIVE STATE (Meeting & Exchanging) */}
      {isApproved && (
        <div className="mt-3 p-3.5 bg-success/10 border border-success/20 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-success font-medium text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Claim Approved — Campus Safe Handover Active</span>
          </div>

          {/* Contact Direct Buttons */}
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

          {/* 4-Digit Handover Passcode Box */}
          <div className="p-3 bg-surface rounded-lg border border-border/80 space-y-2">
            {!showActions ? (
              // Claimant View: Shows the Passcode
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-primary" />
                  <span>Your Pickup Passcode</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="px-3 py-1.5 bg-primary/10 border border-primary/30 rounded font-mono font-bold text-base text-primary tracking-widest">
                    {claim.handoverCode || '4829'}
                  </div>
                  <p className="text-[11px] text-text-muted flex-1">
                    Show this code to the finder when you receive the item.
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-border flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCompleteHandover()}
                    disabled={loading}
                    className="text-xs text-success hover:underline font-medium flex items-center gap-1"
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                    I have received my item
                  </button>
                </div>
              </div>
            ) : (
              // Finder View: Input Code or Confirm Handover
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  <span>Verify Handover at Meetup</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={handoverInputCode}
                    onChange={(e) => setHandoverInputCode(e.target.value)}
                    placeholder="Enter 4-digit code"
                    className="input text-xs py-1.5 px-2.5 w-36 font-mono text-center tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => handleCompleteHandover(handoverInputCode)}
                    disabled={loading}
                    className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap flex items-center gap-1"
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                    Confirm Exchange
                  </button>
                </div>
              </div>
            )}
          </div>

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

      {/* COMPLETED REUNITED STATE */}
      {isHandedOver && (
        <div className="mt-3 p-3.5 bg-success/15 border border-success/30 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-success font-semibold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Successfully Reunited & Handed Over 🎉</span>
            </div>
            <span className="text-[10px] text-text-muted flex items-center gap-1">
              <Lock className="w-3 h-3" /> Contact sealed
            </span>
          </div>

          {claim.thankYouNote ? (
            <div className="p-3 bg-surface rounded-lg border border-border space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>{claim.karmaBadge || '🏅 Campus Good Samaritan'}</span>
              </div>
              <p className="text-xs text-text italic">"{claim.thankYouNote}"</p>
            </div>
          ) : (
            !showActions && (
              <div>
                {!showThankYouForm ? (
                  <button
                    type="button"
                    onClick={() => setShowThankYouForm(true)}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    <Heart className="w-3.5 h-3.5 text-error" />
                    Send a quick Thank You note & Award Karma
                  </button>
                ) : (
                  <form onSubmit={handleSendGratitude} className="space-y-2 mt-2">
                    <input
                      type="text"
                      maxLength={300}
                      value={thankYouText}
                      onChange={(e) => setThankYouText(e.target.value)}
                      placeholder="e.g., Thank you so much for finding my laptop!"
                      className="input text-xs py-1.5"
                      autoFocus
                    />
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={selectedBadge}
                        onChange={(e) => setSelectedBadge(e.target.value)}
                        className="input text-xs py-1 px-2 w-auto"
                      >
                        <option value="🏅 Campus Good Samaritan">🏅 Campus Good Samaritan</option>
                        <option value="⭐ Honest Finder">⭐ Honest Finder</option>
                        <option value="🦸 Campus Hero">🦸 Campus Hero</option>
                      </select>
                      <button
                        type="submit"
                        disabled={loading || !thankYouText.trim()}
                        className="btn-primary text-xs py-1 px-3"
                      >
                        {loading ? 'Sending...' : 'Send Note'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )
          )}
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
