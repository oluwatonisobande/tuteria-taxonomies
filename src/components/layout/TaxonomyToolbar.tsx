import React from 'react';
import { Search, Filter, Plus, X } from 'lucide-react';
import { Button } from '../primitives/Button';
import { TaxonomyType, TAXONOMY_TYPES } from '../../model/taxonomy';
import { PermissionCapabilities } from '../../model/permissions';

export interface TaxonomyToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: TaxonomyType | 'ALL';
  onTypeChange: (type: TaxonomyType | 'ALL') => void;
  selectedCategory: string | 'ALL';
  onCategoryChange: (category: string | 'ALL') => void;
  availableCategories: string[];
  capabilities: PermissionCapabilities;
  onCreateNew: () => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export const TaxonomyToolbar: React.FC<TaxonomyToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  availableCategories,
  capabilities,
  onCreateNew,
  onClearFilters,
  activeFilterCount,
}) => {
  return (
    <div className="py-4 px-6 bg-[var(--surface-raised)] border-b border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search & Filters */}
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search taxonomy names, items, codes..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:bg-[var(--surface-raised)] focus:border-[var(--border-focus)] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-0.5 rounded"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value as TaxonomyType | 'ALL')}
              className="text-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--border-focus)] cursor-pointer"
              aria-label="Filter by Taxonomy Type"
            >
              <option value="ALL">All Types</option>
              {TAXONOMY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter Dropdown */}
          {availableCategories.length > 0 && (
            <div className="flex items-center gap-1.5">
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="text-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--border-focus)] cursor-pointer max-w-[160px] truncate"
                aria-label="Filter by Category"
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-[var(--palette-blue-700)] hover:underline cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Primary Action Button */}
        {capabilities.canEdit && (
          <div className="shrink-0">
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={onCreateNew}
            >
              New Taxonomy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
