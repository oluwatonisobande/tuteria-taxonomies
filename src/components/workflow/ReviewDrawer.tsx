import React from 'react';
import { TaxonomyChange } from '../../model/changes';
import { Drawer } from '../primitives/Drawer';
import { Button } from '../primitives/Button';
import { CheckCircle2, XCircle, Clock, GitCommit, Sparkles } from 'lucide-react';
import { PermissionCapabilities } from '../../model/permissions';

export interface ReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pendingChanges: TaxonomyChange[];
  acceptedChanges: TaxonomyChange[];
  capabilities: PermissionCapabilities;
  onAcceptChange: (changeId: string) => void;
  onRejectChange: (changeId: string) => void;
  onOpenPublish?: () => void;
}

export const ReviewDrawer: React.FC<ReviewDrawerProps> = ({
  isOpen,
  onClose,
  pendingChanges,
  acceptedChanges,
  capabilities,
  onAcceptChange,
  onRejectChange,
  onOpenPublish,
}) => {
  const getImpactBadge = (impact: 'patch' | 'minor' | 'major') => {
    const map = {
      major: 'bg-[var(--palette-rose-50)] text-[var(--palette-rose-700)] border-[var(--palette-rose-100)]',
      minor: 'bg-[var(--palette-amber-50)] text-[var(--palette-amber-700)] border-[var(--palette-amber-100)]',
      patch: 'bg-[var(--palette-blue-50)] text-[var(--palette-blue-700)] border-[var(--palette-blue-200)]',
    };
    return (
      <span
        className={`px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${map[impact]}`}
      >
        {impact} impact
      </span>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Changes & Staged Reviews"
      subtitle="Lifecycle queue: Proposed changes require publisher acceptance before batch release."
      width="max-w-xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {capabilities.canPublish && acceptedChanges.length > 0 && onOpenPublish && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onOpenPublish();
              }}
            >
              Publish Accepted Batch ({acceptedChanges.length})
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Pending Changes Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--palette-amber-600)]" />
              <span>Pending Review ({pendingChanges.length})</span>
            </h3>
          </div>

          {pendingChanges.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] italic p-3 bg-[var(--surface-sunken)] rounded-lg border border-[var(--border-subtle)]">
              No pending change proposals awaiting review.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingChanges.map((change) => (
                <div
                  key={change.id}
                  className="p-3.5 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg shadow-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {change.taxonomyName}
                        </span>
                        {getImpactBadge(change.versionImpact)}
                      </div>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        {change.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)]">
                    <span>
                      By {change.authorName} &bull;{' '}
                      {new Date(change.timestamp).toLocaleDateString()}
                    </span>

                    {capabilities.canReview ? (
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRejectChange(change.id)}
                          className="text-[var(--palette-rose-600)] hover:bg-[var(--palette-rose-50)]"
                        >
                          Reject
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onAcceptChange(change.id)}
                          className="text-[var(--palette-emerald-700)] border-[var(--palette-emerald-100)] bg-[var(--palette-emerald-50)]"
                        >
                          Accept
                        </Button>
                      </div>
                    ) : (
                      <span className="italic text-[10px] text-[var(--palette-amber-600)]">
                        Awaiting publisher review
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accepted Unpublished Section */}
        <div className="pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--palette-emerald-600)]" />
              <span>Accepted & Unpublished ({acceptedChanges.length})</span>
            </h3>
          </div>

          {acceptedChanges.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] italic p-3 bg-[var(--surface-sunken)] rounded-lg border border-[var(--border-subtle)]">
              No accepted changes staged.
            </p>
          ) : (
            <div className="space-y-2">
              {acceptedChanges.map((change) => (
                <div
                  key={change.id}
                  className="p-3 bg-[var(--palette-emerald-50)]/50 border border-[var(--palette-emerald-100)] rounded-lg flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {change.taxonomyName}
                      </span>
                      {getImpactBadge(change.versionImpact)}
                    </div>
                    <p className="mt-1 text-[var(--text-secondary)]">{change.summary}</p>
                    <span className="text-[10px] text-[var(--text-tertiary)] mt-1 block">
                      Approved &bull; Queued for next release
                    </span>
                  </div>
                  {capabilities.canReview && (
                    <button
                      type="button"
                      onClick={() => onRejectChange(change.id)}
                      className="text-[var(--text-tertiary)] hover:text-[var(--palette-rose-600)] p-1"
                      title="Revoke / Remove from release"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
