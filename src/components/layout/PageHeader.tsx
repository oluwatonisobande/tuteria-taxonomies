import React from 'react';
import { Button } from '../primitives/Button';
import { History, GitPullRequest, UploadCloud, Shield } from 'lucide-react';
import { PermissionRole, PermissionCapabilities } from '../../model/permissions';

export interface PageHeaderProps {
  version: string;
  unpublishedCount: number;
  pendingCount: number;
  currentRole: PermissionRole;
  capabilities: PermissionCapabilities;
  onRoleChange: (role: PermissionRole) => void;
  onOpenReview: () => void;
  onOpenHistory: () => void;
  onOpenPublish: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  version,
  unpublishedCount,
  pendingCount,
  currentRole,
  capabilities,
  onRoleChange,
  onOpenReview,
  onOpenHistory,
  onOpenPublish,
}) => {
  return (
    <header className="bg-[var(--surface-raised)] border-b border-[var(--border-subtle)] px-4 sm:px-6 py-4 sm:py-5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        {/* Title & Version Info */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-[var(--text-primary)] font-display tracking-tight">
              Taxonomies Management
            </h1>

            {/* Semantic Version Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
              <span>{version}</span>
              {unpublishedCount > 0 && (
                <span
                  className="px-1.5 py-0.2 rounded-full bg-[var(--palette-amber-100)] text-[var(--palette-amber-700)] font-semibold"
                  title={`${unpublishedCount} accepted unpublished changes queued`}
                >
                  +{unpublishedCount}
                </span>
              )}
            </div>

            {/* Role indicator */}
            <div className="flex items-center gap-1.5 bg-[var(--surface-sunken)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)] text-xs">
              <Shield className="w-3.5 h-3.5 text-[var(--palette-blue-700)]" />
              <span className="text-[var(--text-tertiary)]">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as PermissionRole)}
                className="bg-transparent font-medium text-[var(--text-primary)] cursor-pointer focus:outline-none"
                aria-label="Switch User Role"
              >
                <option value="publisher">Publisher (Full Access)</option>
                <option value="editor">Editor (Pending Flow)</option>
                <option value="view_only">View Only (Read-Only)</option>
                <option value="no_access">No Access</option>
              </select>
            </div>
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Canonical educational taxonomy structures, learning benchmarks, and international localization.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Version History */}
          <Button
            variant="secondary"
            size="sm"
            icon={<History className="w-3.5 h-3.5" />}
            onClick={onOpenHistory}
            title="View taxonomy version audit trail"
          >
            History
          </Button>

          {/* Pending Review Drawer Trigger */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              icon={<GitPullRequest className="w-3.5 h-3.5" />}
              onClick={onOpenReview}
              title="Review proposed changes"
            >
              Changes
              {(pendingCount > 0 || unpublishedCount > 0) && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[var(--palette-blue-700)] text-white">
                  {pendingCount + unpublishedCount}
                </span>
              )}
            </Button>
          </div>

          {/* Publish Batch (Publisher Only) */}
          {capabilities.canPublish && (
            <Button
              variant="primary"
              size="sm"
              icon={<UploadCloud className="w-3.5 h-3.5" />}
              onClick={onOpenPublish}
              disabled={unpublishedCount === 0}
              title={
                unpublishedCount > 0
                  ? `Publish ${unpublishedCount} accepted change${unpublishedCount === 1 ? '' : 's'} as a new version`
                  : 'No accepted changes queued for release'
              }
            >
              Publish {unpublishedCount > 0 ? `(${unpublishedCount})` : ''}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
