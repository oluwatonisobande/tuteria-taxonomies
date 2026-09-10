import React from 'react';

interface ItemCountProps {
  count: number;
}

export const ItemCount: React.FC<ItemCountProps> = ({ count }) => {
  if (count === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--palette-neutral-100)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]">
        0 items
      </span>
    );
  }

  return (
    <span className="text-sm font-medium text-[var(--text-primary)] font-mono">
      {count} <span className="text-xs text-[var(--text-tertiary)] font-normal">{count === 1 ? 'item' : 'items'}</span>
    </span>
  );
};
