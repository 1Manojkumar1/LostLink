import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, Loader2, AlertCircle } from 'lucide-react';
import { getMyMatches } from '../services/matchService';
import MatchCard from '../components/MatchCard';
import Navbar from '../components/Navbar';

export default function Matches() {
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getMyMatches();
        setAllMatches(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

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

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="page-container page-section">
        <div className="mb-8">
          <h1 className="page-title mb-2">Possible Matches</h1>
          <p className="page-subtitle">
            LostLink compares reports using category, location, description, and date.
          </p>
        </div>

        {error && (
          <div className="card mb-6 flex items-center gap-3 border-error/30">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
            <p className="text-sm text-text-secondary flex-1">{error}</p>
          </div>
        )}

        {!loading && !error && allMatches.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
              <GitCompare className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="text-lg font-semibold text-text mb-2">No Strong Matches</h2>
            <p className="text-text-secondary mb-6">
              We couldn't find a strong match for any reports yet.
              New reports may create a match later.
            </p>
            <Link to="/items" className="btn-primary">Browse Items</Link>
          </div>
        )}

        {allMatches.length > 0 && (
          <>
            <p className="text-sm text-text-muted mb-6">
              {allMatches.length} possible match{allMatches.length !== 1 ? 'es' : ''} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allMatches.map((match, index) => (
                <div key={`${match.item.id}-${index}`} className="relative">
                  <div className="absolute -top-2 -left-2 z-10">
                    <span className="badge bg-surface-elevated text-text-muted text-[10px] shadow-sm">
                      For: {match.sourceItem.title}
                    </span>
                  </div>
                  <MatchCard match={match} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
