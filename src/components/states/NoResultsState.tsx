import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '../primitives/Button';

interface NoResultsStateProps {
  searchQuery?: string;
  onClearFilters: () => void;
}

export const NoResultsState: React.FC<NoResultsStateProps> = ({
  searchQuery,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--surface-raised)] rounded-xl border border-[var(--border-subtle)] my-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--palette-neutral-100)] text-[var(--text-tertiary)] mb-4">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] font-display">
        No results found
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-md">
        {searchQuery ? (
          <>
            No records matched your search query <span className="font-semibold text-[var(--text-primary)]">"{searchQuery}"</span>. Try checking for spelling or clearing filters.
          </>
        ) : (
          'No records match the current filter criteria. Try selecting a different type or category.'
        )}
      </p>
      <div className="mt-5">
        <Button variant="secondary" onClick={onClearFilters}>
          Clear all filters
        </Button>
      </div>
    </div>
  );
};
