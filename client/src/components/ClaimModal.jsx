import { useState, useEffect, useCallback } from 'react';
import { Shield, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClaim } from '../services/claimService';

export default function ClaimModal({ item, onClose, onSuccess }) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!answer.trim()) {
      setError('Please provide an answer');
      return;
    }

    setLoading(true);
    try {
      await createClaim({ itemId: item.id, answer: answer.trim() });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  const isLostItem = item.type === 'LOST';

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="card max-w-sm w-full text-center" role="dialog" aria-modal="true">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">
            {isLostItem ? 'Handover Notice Sent' : 'Claim Submitted'}
          </h3>
          <p className="text-sm text-text-secondary">
            {isLostItem
              ? 'The owner has been notified that you found their item. They will review your notice and coordinate handover.'
              : 'Your claim has been submitted and is awaiting approval from the finder.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card max-w-md w-full" role="dialog" aria-modal="true" aria-labelledby="claim-title">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 id="claim-title" className="text-lg font-semibold text-text">
              {isLostItem ? 'I Found This Item!' : 'Claim Item'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-elevated transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-surface-elevated rounded-lg">
          <p className="text-sm text-text-secondary">Item</p>
          <p className="font-medium text-text">{item.title}</p>
          <p className="text-xs text-text-muted mt-1">{item.category} · {item.location}</p>
        </div>

        {isLostItem ? (
          <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-primary mb-1">Handover Note</p>
            <p className="text-xs text-text-secondary">
              Let the owner know where you found their item or how to get in touch for returning it.
            </p>
          </div>
        ) : (
          <div className="mb-4 p-3.5 bg-primary/5 rounded-lg border border-primary/20 space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Verification Question</p>
            <p className="text-sm font-medium text-text">{item.verificationQuestion || 'What distinguishes this item?'}</p>
            {item.verificationHint && (
              <p className="text-xs text-text-secondary pt-1 border-t border-primary/10 flex items-center gap-1.5">
                <span className="text-primary font-bold">💡 Hint:</span> {item.verificationHint}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg mb-4" role="alert">
              <AlertCircle className="w-4 h-4 text-error flex-shrink-0" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="claim-answer" className="block text-sm font-medium text-text-secondary mb-1.5">
              {isLostItem ? 'Details / Location Found' : 'Your Answer'}
            </label>
            <input
              id="claim-answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="input"
              placeholder={isLostItem ? 'e.g., I found your wallet at the library desk' : 'Enter the verification answer'}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn-ghost" disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {isLostItem ? 'Send Handover Notice' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
