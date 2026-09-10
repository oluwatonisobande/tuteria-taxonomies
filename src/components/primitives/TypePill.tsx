import React from 'react';
import { TaxonomyType } from '../../model/taxonomy';

interface TypePillProps {
  type: TaxonomyType;
  size?: 'sm' | 'md';
}

const TYPE_STYLES: Record<TaxonomyType, { bg: string; text: string; border: string }> = {
  Levels: {
    bg: 'bg-[var(--palette-blue-50)]',
    text: 'text-[var(--palette-blue-700)]',
    border: 'border-[var(--palette-blue-200)]',
  },
  Terms: {
    bg: 'bg-[var(--palette-amber-50)]',
    text: 'text-[var(--palette-amber-700)]',
    border: 'border-[var(--palette-amber-100)]',
  },
  'Learning Systems': {
    bg: 'bg-[var(--palette-purple-50)]',
    text: 'text-[var(--palette-purple-700)]',
    border: 'border-[var(--palette-purple-100)]',
  },
  'Learning Goals': {
    bg: 'bg-[var(--palette-emerald-50)]',
    text: 'text-[var(--palette-emerald-700)]',
    border: 'border-[var(--palette-emerald-100)]',
  },
  'Exam Boards': {
    bg: 'bg-[var(--palette-blue-50)]',
    text: 'text-[var(--palette-blue-800)]',
    border: 'border-[var(--palette-blue-200)]',
  },
  Skills: {
    bg: 'bg-[var(--palette-neutral-100)]',
    text: 'text-[var(--palette-neutral-700)]',
    border: 'border-[var(--palette-neutral-200)]',
  },
};

export const TypePill: React.FC<TypePillProps> = ({ type, size = 'sm' }) => {
  const styles = TYPE_STYLES[type] || {
    bg: 'bg-[var(--palette-neutral-100)]',
    text: 'text-[var(--palette-neutral-700)]',
    border: 'border-[var(--palette-neutral-200)]',
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-medium leading-4'
      : 'px-2.5 py-1 text-xs font-medium leading-5';

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap tracking-wide select-none ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses}`}
      title={`Taxonomy Type: ${type}`}
    >
      {type}
    </span>
  );
};
