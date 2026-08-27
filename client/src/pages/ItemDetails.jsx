import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, Package, Shield, Loader2, Trash2, Edit, ArrowLeft, GitCompare, CheckCircle2, AlertCircle } from 'lucide-react';
import { getItemById, deleteItem } from '../services/itemService';
import { getItemMatches } from '../services/matchService';
import { useAuth } from '../context/AuthContext';
import { formatDateLong } from '../utils/formatDate';
import MatchCard from '../components/MatchCard';
import ClaimModal from '../components/ClaimModal';
import StatusBadge from '../components/StatusBadge';
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
        setError(err.response?.data?.message || 'Failed to load item');
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
      setError(err.response?.data?.message || 'Failed to delete item');
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

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/items" className="inline-flex items-center gap-2 text-text-secondary hover:text-text mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square bg-surface rounded-xl flex items-center justify-center overflow-hidden border border-border">
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-24 h-24 text-text-muted" />
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
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{formatDateLong(item.date)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="section-title mb-2">Description</h2>
              <p className="text-text-secondary leading-relaxed">{item.description}</p>
            </div>

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

            <div className="mb-6 text-sm text-text-muted">
              Reported by {item.userId?.name || 'Unknown'} on {formatDateLong(item.createdAt)}
            </div>

            {isOwner ? (
              <div className="flex gap-3">
                <button onClick={() => navigate(`/items/${id}/edit`)} className="btn-ghost flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="btn-danger flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            ) : (
              item.type === 'FOUND' &&
              item.status === 'ACTIVE' &&
              user &&
              item.verificationQuestion && (
                <div>
                  {claimSuccess ? (
                    <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="font-medium text-success">Claim submitted successfully</span>
                    </div>
                  ) : (
                    <button onClick={() => setShowClaimModal(true)} className="btn-primary flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Claim This Item
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
