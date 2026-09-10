import React, { useState } from 'react';
import { Dialog } from '../primitives/Dialog';
import { TaxonomyChange, VersionImpact } from '../../model/changes';
import { Semver, bumpVersion, formatSemver, parseSemver, getHighestImpact } from '../../model/versioning';
import { ArrowRight, UploadCloud, Sparkles, CheckCircle } from 'lucide-react';

export interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: string;
  acceptedChanges: TaxonomyChange[];
  onConfirmPublish: (newVersion: string, releaseSummary: string, impact: VersionImpact) => void;
}

export const PublishDialog: React.FC<PublishDialogProps> = ({
  isOpen,
  onClose,
  currentVersion,
  acceptedChanges,
  onConfirmPublish,
}) => {
  const currentSemver = parseSemver(currentVersion);
  const highestImpact: VersionImpact =
    acceptedChanges.length > 0
      ? getHighestImpact(acceptedChanges.map((c) => c.versionImpact))
      : 'patch';

  const nextSemver = bumpVersion(currentSemver, highestImpact);
  const nextVersionStr = formatSemver(nextSemver);

  const [summary, setSummary] = useState(
    `Release ${nextVersionStr}: includes ${acceptedChanges.length} updates across taxonomies.`
  );

  const handlePublish = () => {
    onConfirmPublish(nextVersionStr, summary, highestImpact);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Publish Taxonomy Release"
      description="Publishing will bundle all accepted changes, increment the canonical semantic version, and record an immutable version history milestone."
      confirmLabel={`Publish ${nextVersionStr}`}
      cancelLabel="Cancel"
      onConfirm={handlePublish}
      variant="primary"
      icon={
        <div className="mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--palette-blue-50)] text-[var(--palette-blue-700)]">
          <UploadCloud className="h-5 w-5" />
        </div>
      }
    >
      <div className="space-y-4 text-left mt-3">
        {/* Version Bump Comparison */}
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] font-mono text-sm">
          <div>
            <span className="text-xs text-[var(--text-tertiary)] block font-sans">
              Current Version
            </span>
            <span className="font-bold text-[var(--text-secondary)]">{currentVersion}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-sans uppercase font-bold text-[var(--palette-blue-700)] px-1.5 py-0.2 rounded bg-white border border-[var(--palette-blue-200)]">
              {highestImpact} bump
            </span>
            <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
          </div>

          <div className="text-right">
            <span className="text-xs text-[var(--palette-emerald-700)] block font-sans font-medium">
              New Version
            </span>
            <span className="font-bold text-[var(--palette-emerald-700)]">
              {nextVersionStr}
            </span>
          </div>
        </div>

        {/* Release Summary input */}
        <div>
          <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
            Release Notes / Summary
          </label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
          />
        </div>

        {/* Changes list in this release */}
        <div>
          <span className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Bundled Changes ({acceptedChanges.length})
          </span>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {acceptedChanges.map((c) => (
              <div
                key={c.id}
                className="text-xs p-2 rounded bg-[var(--surface-sunken)] border border-[var(--border-subtle)] flex items-start gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[var(--palette-emerald-600)] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[var(--text-primary)]">
                    {c.taxonomyName}:{' '}
                  </span>
                  <span className="text-[var(--text-secondary)]">{c.summary}</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold text-[var(--text-tertiary)] shrink-0">
                  {c.versionImpact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
