import { useState, useEffect } from 'react';
import { Package, Loader2, AlertCircle } from 'lucide-react';
import { getItems } from '../services/itemService';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import Navbar from '../components/Navbar';

export default function BrowseItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', category: '', location: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 12, totalItems: 0, totalPages: 0 });

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (search) params.search = search;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;

      const res = await getItems(params);
      setItems(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, filters, pagination.page]);

  const handleSearch = (value) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ type: '', category: '', location: '' });
    setSearch('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="page-container page-section">
        <div className="mb-8">
          <h1 className="page-title mb-2">Browse Items</h1>
          <p className="page-subtitle">
            {pagination.totalItems} active report{pagination.totalItems !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <SearchBar onSearch={handleSearch} initialValue={search} />
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
        </div>

        {error && (
          <div className="card mb-6 flex items-center gap-3 border-error/30">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
            <p className="text-sm text-text-secondary flex-1">{error}</p>
            <button onClick={fetchItems} className="btn-ghost text-sm">Retry</button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="text-lg font-semibold text-text mb-2">No Items Found</h2>
            <p className="text-text-secondary mb-6">Try changing your search or filters.</p>
            <button onClick={handleClearFilters} className="btn-primary">Clear Filters</button>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="btn-ghost text-sm"
                >
                  Previous
                </button>
                <span className="text-sm text-text-secondary font-mono">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn-ghost text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
