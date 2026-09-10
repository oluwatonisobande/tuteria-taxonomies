import React from 'react';
import { Layers, ListFilter } from 'lucide-react';

export type TabType = 'taxonomies' | 'items';

export interface TaxonomyTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  taxonomiesCount: number;
  itemsCount: number;
}

export const TaxonomyTabs: React.FC<TaxonomyTabsProps> = ({
  activeTab,
  onTabChange,
  taxonomiesCount,
  itemsCount,
}) => {
  return (
    <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-raised)] px-6">
      <div className="max-w-7xl mx-auto flex items-center space-x-8" role="tablist">
        {/* Taxonomies Tab */}
        <button
          role="tab"
          id="tab-taxonomies"
          aria-selected={activeTab === 'taxonomies'}
          aria-controls="panel-taxonomies"
          onClick={() => onTabChange('taxonomies')}
          className={`flex items-center gap-2 py-3.5 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer outline-none ${
            activeTab === 'taxonomies'
              ? 'border-[var(--palette-blue-700)] text-[var(--palette-blue-700)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Taxonomies</span>
          <span
            className={`ml-1 px-2 py-0.5 text-xs rounded-full font-mono font-medium ${
              activeTab === 'taxonomies'
                ? 'bg-[var(--palette-blue-50)] text-[var(--palette-blue-700)]'
                : 'bg-[var(--surface-sunken)] text-[var(--text-tertiary)]'
            }`}
          >
            {taxonomiesCount}
          </span>
        </button>

        {/* Items Tab */}
        <button
          role="tab"
          id="tab-items"
          aria-selected={activeTab === 'items'}
          aria-controls="panel-items"
          onClick={() => onTabChange('items')}
          className={`flex items-center gap-2 py-3.5 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer outline-none ${
            activeTab === 'items'
              ? 'border-[var(--palette-blue-700)] text-[var(--palette-blue-700)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)]'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Items</span>
          <span
            className={`ml-1 px-2 py-0.5 text-xs rounded-full font-mono font-medium ${
              activeTab === 'items'
                ? 'bg-[var(--palette-blue-50)] text-[var(--palette-blue-700)]'
                : 'bg-[var(--surface-sunken)] text-[var(--text-tertiary)]'
            }`}
          >
            {itemsCount}
          </span>
        </button>
      </div>
    </div>
  );
};
