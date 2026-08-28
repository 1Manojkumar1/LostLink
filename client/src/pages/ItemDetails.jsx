import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Calendar, Tag, Package, Shield, Loader2, Trash2, ArrowLeft,
  GitCompare, CheckCircle2, Clock, User, Phone, Mail, Info, Lock
} from 'lucide-react';
import { getItemById, deleteItem } from '../services/itemService';
import { getItemMatches } from '../services/matchService';
import { useAuth } from '../context/AuthContext';
import { formatDateLong } from '../utils/formatDate';
import { LOCATION_TYPES } from '../utils/constants';
import MatchCard from '../components/MatchCard';
import ClaimModal from '../components/ClaimModal';
import StatusBadge from '../components/StatusBadge';
import RecoveryTimeline from '../components/RecoveryTimeline';
import Navbar from '../components/Navbar';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getItemById(id);
        setItem(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load item');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    if (!item) return;
    const fetchMatches = async () => {
      setMatchesLoading(true);
      try {
        const res = await getItemMatches(id);
        setMatches(res.data.matches || []);
      } catch {
        // matches are optional
      } finally {
        setMatchesLoading(false);
      }
    };
    fetchMatches();
  }, [id, item]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteItem(id);
      navigate('/items');
    } catch (err) {
      setError(err.message || 'Failed to delete item');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

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

  if (error || !item) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="flex items-center justify-center px-6" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <div className="card max-w-md w-full text-center">
            <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">Item Not Found</h2>
            <p className="text-text-secondary mb-6">{error || 'The item you are looking for does not exist.'}</p>
            <Link to="/items" className="btn-primary">Browse Items</Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && item.userId && user.id === item.userId._id;
  const locationLabel = LOCATION_TYPES.find((l) => l.value === item.locationType)?.label;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="page-container page-section">
        <Link to="/items" className="inline-flex items-center gap-2 text-text-secondary hover:text-text mb-6 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-surface rounded-xl flex items-center justify-center overflow-hidden border border-border">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-24 h-24 text-text-muted" />
              )}
            </div>
            {item.photos && item.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.photos.slice(0, 4).map((photo, i) => (
                  <div key={i} className="aspect-square bg-surface rounded-lg overflow-hidden border border-border">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <StatusBadge status={item.type} />
              <StatusBadge status={item.status} />
            </div>

            <h1 className="text-2xl font-bold text-text mb-4">{item.title}</h1>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-text-secondary">
                <Tag className="w-4 h-4 flex-shrink-0" />
                <span>{item.category}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{item.location}{locationLabel ? ` (${locationLabel})` : ''}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{formatDateLong(item.date)}{item.lostTime ? ` at ${item.lostTime}` : ''}</span>
              </div>
            </div>

            {/* Item attributes */}
            {(item.brand || item.model || item.color || item.size) && (
              <div className="mb-6">
                <h2 className="section-title mb-2">Details</h2>
                <div className="flex flex-wrap gap-3">
                  {item.brand && <span className="text-sm bg-surface-elevated px-3 py-1 rounded-md text-text-secondary">{item.brand}</span>}
                  {item.model && <span className="text-sm bg-surface-elevated px-3 py-1 rounded-md text-text-secondary">{item.model}</span>}
                  {item.color && <span className="text-sm bg-surface-elevated px-3 py-1 rounded-md text-text-secondary">{item.color}</span>}
                  {item.size && <span className="text-sm bg-surface-elevated px-3 py-1 rounded-md text-text-secondary">{item.size}</span>}
                </div>
              </div>
            )}

            {item.distinctiveFeatures && (
              <div className="mb-6">
                <h2 className="section-title mb-2">Distinctive Features</h2>
                <p className="text-text-secondary text-sm">{item.distinctiveFeatures}</p>
              </div>
            )}

            <div className="mb-6">
              <h2 className="section-title mb-2">Description</h2>
              <p className="text-text-secondary leading-relaxed">{item.description}</p>
            </div>

            {item.approximateValue && (
              <div className="mb-6">
                <h2 className="section-title mb-2">Approximate Value</h2>
                <p className="text-text-secondary">${item.approximateValue}</p>
              </div>
            )}

            {item.circumstances && (
              <div className="mb-6">
                <h2 className="section-title mb-2">Circumstances</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{item.circumstances}</p>
              </div>
            )}

            {/* Owner-only: Identification info */}
            {isOwner && (item.serialNumber || item.imei || item.deviceModel || item.engraving || item.uniqueMarkings || item.stickers) && (
              <div className="mb-6 p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-text-muted" />
                  <h2 className="text-sm font-medium text-text">Identification (Private)</h2>
                </div>
                <div className="space-y-2 text-sm">
                  {item.serialNumber && <div><span className="text-text-muted">Serial:</span> <span className="text-text-secondary">{item.serialNumber}</span></div>}
                  {item.imei && <div><span className="text-text-muted">IMEI:</span> <span className="text-text-secondary">{item.imei}</span></div>}
                  {item.deviceModel && <div><span className="text-text-muted">Device:</span> <span className="text-text-secondary">{item.deviceModel}</span></div>}
                  {item.engraving && <div><span className="text-text-muted">Engraving:</span> <span className="text-text-secondary">{item.engraving}</span></div>}
                  {item.uniqueMarkings && <div><span className="text-text-muted">Markings:</span> <span className="text-text-secondary">{item.uniqueMarkings}</span></div>}
                  {item.stickers && <div><span className="text-text-muted">Stickers:</span> <span className="text-text-secondary">{item.stickers}</span></div>}
                </div>
              </div>
            )}

            {/* Owner-only: Contact info */}
            {isOwner && (item.contactName || item.contactEmail || item.contactPhone) && (
              <div className="mb-6 p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-text-muted" />
                  <h2 className="text-sm font-medium text-text">Contact Information (Private)</h2>
                </div>
                <div className="space-y-2 text-sm">
                  {item.contactName && <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-text-muted" /><span className="text-text-secondary">{item.contactName}</span></div>}
                  {item.contactEmail && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-text-muted" /><span className="text-text-secondary">{item.contactEmail}</span></div>}
                  {item.contactPhone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-text-muted" /><span className="text-text-secondary">{item.contactPhone}</span></div>}
                </div>
              </div>
            )}

            {/* Owner-only: Security info */}
            {isOwner && item.securityInfo && (item.securityInfo.deviceLocked || item.securityInfo.cardBlocked || item.securityInfo.idReported) && (
              <div className="mb-6 p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-warning" />
                  <span className="font-medium text-text text-sm">Security Measures Taken</span>
                </div>
                <div className="space-y-1 text-sm text-text-secondary">
                  {item.securityInfo.deviceLocked && <p>Device/account has been locked</p>}
                  {item.securityInfo.cardBlocked && <p>Card has been blocked</p>}
                  {item.securityInfo.idReported && <p>ID has been reported</p>}
                </div>
              </div>
            )}

            {item.type === 'FOUND' && item.verificationQuestion && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-medium text-text text-sm">Verification Required</span>
                </div>
                <p className="text-sm text-text-secondary">
                  This item requires verification before claiming. The owner will need to answer a security question.
                </p>
              </div>
            )}

            <div className="mb-6">
              <RecoveryTimeline item={item} />
            </div>

            <div className="mb-6 text-sm text-text-muted">
              Reported by {item.userId?.name || 'Unknown'} on {formatDateLong(item.createdAt)}
            </div>

            {isOwner ? (
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(true)} className="btn-danger flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            ) : (
              item.status === 'ACTIVE' &&
              user && (
                <div>
                  {claimSuccess ? (
                    <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="font-medium text-success">
                        {item.type === 'LOST' ? 'Handover notice submitted successfully' : 'Claim submitted successfully'}
                      </span>
                    </div>
                  ) : (
                    <button onClick={() => setShowClaimModal(true)} className="btn-primary flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {item.type === 'LOST' ? 'I Found Your Item!' : 'Claim This Item'}
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Matches Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-3 mb-6">
            <GitCompare className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-text">Possible Matches</h2>
          </div>

          {matchesLoading && (
            <div className="flex items-center gap-2 text-text-secondary py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Finding possible matches...
            </div>
          )}

          {!matchesLoading && matches.length === 0 && (
            <div className="card text-center py-8">
              <GitCompare className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <h3 className="font-semibold text-text mb-2">No Strong Matches</h3>
              <p className="text-sm text-text-secondary">
                We couldn't find a strong match for this report yet.
                New reports may create a match later.
              </p>
            </div>
          )}

          {!matchesLoading && matches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.map((match) => (
                <MatchCard key={match.item.id} match={match} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showClaimModal && (
        <ClaimModal item={item} onClose={() => setShowClaimModal(false)} onSuccess={() => setClaimSuccess(true)} />
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}>
          <div className="card max-w-sm w-full" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <h3 id="delete-title" className="text-lg font-semibold text-text mb-2">Delete this report?</h3>
            <p className="text-text-secondary mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(false)} className="btn-ghost" disabled={deleting}>Cancel</button>
              <button onClick={handleDelete} className="btn-danger flex items-center gap-2" disabled={deleting}>
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
