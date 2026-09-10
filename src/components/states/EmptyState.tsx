import React from 'react';
import { Layers, Plus } from 'lucide-react';
import { Button } from '../primitives/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No taxonomies configured',
  description = 'Get started by creating your first educational taxonomy structure to categorize levels, terms, or curriculum goals.',
  actionLabel = 'Create Taxonomy',
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--surface-raised)] rounded-xl border border-dashed border-[var(--border-medium)] my-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--palette-blue-50)] text-[var(--palette-blue-700)] mb-4">
        {icon || <Layers className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] font-display">
        {title}
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
        {description}
      </p>
      {onAction && (
        <div className="mt-5">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
