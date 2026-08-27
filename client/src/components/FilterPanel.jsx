import { X } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

export default function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const hasActiveFilters = filters.type || filters.category || filters.location;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Type Filter */}
      <div className="flex gap-1.5">
        {[
          { value: '', label: 'All' },
          { value: 'LOST', label: 'Lost' },
          { value: 'FOUND', label: 'Found' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange({ ...filters, type: option.value })}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              filters.type === option.value
                ? option.value === 'LOST'
                  ? 'bg-error/10 border-error text-error'
                  : option.value === 'FOUND'
                  ? 'bg-success/10 border-success text-success'
                  : 'bg-primary/10 border-primary text-primary'
                : 'bg-surface border-border text-text-secondary hover:border-text-muted'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <select
        value={filters.category}
        onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        className="input w-auto min-w-[140px]"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Location Filter */}
      <input
        type="text"
        value={filters.location}
        onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
        placeholder="Location"
        className="input w-auto min-w-[140px]"
      />

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
