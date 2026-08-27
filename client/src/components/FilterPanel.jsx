import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, ITEM_STATUSES } from '../utils/constants';

export default function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const [expanded, setExpanded] = useState(false);
  const hasActiveFilters = filters.type || filters.category || filters.location || filters.date || filters.status;

  return (
    <div>
      {/* Mobile toggle */}
      <div className="flex items-center justify-between md:hidden mb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
          aria-expanded={expanded}
          aria-controls="filter-panel"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary rounded-full" />
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-text-muted hover:text-text transition-colors"
            aria-label="Clear all filters"
          >
            Clear
          </button>
        )}
      </div>

      {/* Desktop always visible, mobile collapsible */}
      <div
        id="filter-panel"
        className={`${expanded ? 'block' : 'hidden'} md:block`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5">
            {[
              { value: '', label: 'All' },
              { value: 'LOST', label: 'Lost' },
              { value: 'FOUND', label: 'Found' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange({ ...filters, type: option.value })}
                aria-pressed={filters.type === option.value}
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

          <div>
            <label htmlFor="filter-category" className="sr-only">Category</label>
            <select
              id="filter-category"
              value={filters.category}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
              className="input w-auto min-w-[140px]"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-status" className="sr-only">Status</label>
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="input w-auto min-w-[140px]"
            >
              <option value="">All Status</option>
              {ITEM_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-location" className="sr-only">Location</label>
            <input
              id="filter-location"
              type="text"
              value={filters.location}
              onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
              placeholder="Location"
              className="input w-auto min-w-[140px]"
            />
          </div>

          <div>
            <label htmlFor="filter-date" className="sr-only">Date</label>
            <input
              id="filter-date"
              type="date"
              value={filters.date}
              onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
              className="input w-auto min-w-[140px]"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors"
              aria-label="Clear all filters"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
