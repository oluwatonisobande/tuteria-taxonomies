import React from 'react';

interface CategoryPillProps {
  label: string;
  size?: 'sm' | 'md';
}

export const CategoryPill: React.FC<CategoryPillProps> = ({ label, size = 'sm' }) => {
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-normal leading-4'
      : 'px-2.5 py-1 text-xs font-normal leading-5';

  return (
    <span
      className={`inline-flex items-center rounded-full bg-[var(--palette-neutral-100)] border border-[var(--border-subtle)] text-[var(--text-secondary)] whitespace-nowrap ${sizeClasses}`}
      title={`Category: ${label}`}
    >
      {label}
    </span>
  );
};

interface CategoryListProps {
  categories: string[];
  maxDisplay?: number;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  maxDisplay = 2,
}) => {
  if (!categories || categories.length === 0) {
    return <span className="text-xs text-[var(--text-muted)] italic">—</span>;
  }

  const displayed = categories.slice(0, maxDisplay);
  const remaining = categories.length - maxDisplay;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {displayed.map((cat, idx) => (
        <CategoryPill key={`${cat}-${idx}`} label={cat} />
      ))}
      {remaining > 0 && (
        <span
          className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-[var(--text-tertiary)] bg-[var(--surface-sunken)] rounded-full border border-[var(--border-subtle)] cursor-help"
          title={`Other categories: ${categories.slice(maxDisplay).join(', ')}`}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
};
