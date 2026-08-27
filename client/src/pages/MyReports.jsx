import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageX, PackageCheck, Loader2, Package, AlertCircle } from 'lucide-react';
import { getMyItems } from '../services/itemService';
import ItemCard from '../components/ItemCard';
import Navbar from '../components/Navbar';

export default function MyReports() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getMyItems();
        setItems(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load your reports');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = filter === 'ALL' ? items : items.filter((item) => item.type === filter);
  const lostItems = items.filter((item) => item.type === 'LOST');
  const foundItems = items.filter((item) => item.type === 'FOUND');

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
          <h1 className="page-title mb-2">My Reports</h1>
          <p className="page-subtitle">{items.length} total report{items.length !== 1 ? 's' : ''}</p>
        </div>

        {error && (
          <div className="card mb-6 flex items-center gap-3 border-error/30">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
            <p className="text-sm text-text-secondary flex-1">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-xl font-bold text-text">{items.length}</p>
              <p className="text-xs text-text-muted">Total</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <PackageX className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-xl font-bold text-text">{lostItems.length}</p>
              <p className="text-xs text-text-muted">Lost</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <PackageCheck className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-text">{foundItems.length}</p>
              <p className="text-xs text-text-muted">Found</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'ALL', label: 'All Reports' },
            { value: 'LOST', label: 'Lost' },
            { value: 'FOUND', label: 'Found' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filter === tab.value
                  ? 'bg-primary text-bg font-medium'
                  : 'bg-surface text-text-secondary hover:text-text border border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {items.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="text-lg font-semibold text-text mb-2">No Reports Yet</h2>
            <p className="text-text-secondary mb-6">Start by reporting a lost or found item.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/report?type=LOST" className="btn-primary flex items-center gap-2">
                <PackageX className="w-4 h-4" />
                Report Lost
              </Link>
              <Link to="/report?type=FOUND" className="btn-ghost flex items-center gap-2">
                <PackageCheck className="w-4 h-4" />
                Report Found
              </Link>
            </div>
          </div>
        )}

        {items.length > 0 && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-text mb-2">No {filter} Reports</h2>
            <p className="text-text-secondary">You haven't reported any {filter.toLowerCase()} items yet.</p>
          </div>
        )}

        {filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
