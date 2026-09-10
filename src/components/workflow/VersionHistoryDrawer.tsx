import React from 'react';
import { VersionHistoryEntry } from '../../model/versioning';
import { Drawer } from '../primitives/Drawer';
import { Button } from '../primitives/Button';
import { History, Tag, User, Calendar, CheckCircle } from 'lucide-react';

export interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: VersionHistoryEntry[];
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Taxonomy Version History"
      subtitle="Immutable audit trail of published taxonomy schema releases and batch bumps."
      width="max-w-xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="relative pl-6 border-l-2 border-[var(--border-subtle)] space-y-6 ml-2">
          {history.map((entry) => (
            <div key={entry.id} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[var(--palette-blue-700)] ring-4 ring-[var(--palette-blue-50)] flex items-center justify-center text-white" />

              <div className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[var(--palette-blue-700)]">
                      {entry.version}
                    </span>
                    <span className="px-1.5 py-0.2 text-[10px] font-mono uppercase font-bold rounded bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {entry.impact} release
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {new Date(entry.publishedAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-primary)] font-medium">
                  {entry.summary}
                </p>

                <div className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1.5 pt-1">
                  <User className="w-3 h-3" />
                  <span>Published by {entry.publishedBy}</span>
                  <span>&bull; {entry.changesCount} changes bundled</span>
                </div>

                {entry.changes && entry.changes.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] space-y-1">
                    {entry.changes.map((c) => (
                      <div
                        key={c.id}
                        className="text-[11px] text-[var(--text-secondary)] flex items-start gap-1.5"
                      >
                        <CheckCircle className="w-3 h-3 text-[var(--palette-emerald-600)] shrink-0 mt-0.5" />
                        <span>{c.summary}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};
