import React, { useState, useMemo } from 'react';
import { Taxonomy, TaxonomyInput, TaxonomyType, FlattenedItemView } from '../model/taxonomy';
import { TaxonomyChange, VersionImpact, getVersionImpact } from '../model/changes';
import { VersionHistoryEntry, bumpVersion, formatSemver, parseSemver } from '../model/versioning';
import { PermissionRole, getCapabilities } from '../model/permissions';
import { filterTaxonomies, flattenItems, filterFlattenedItems, FilterState } from '../utils/filtering';

// Layout & Navigation
import { PageHeader } from './layout/PageHeader';
import { TaxonomyTabs, TabType } from './layout/TaxonomyTabs';
import { TaxonomyToolbar } from './layout/TaxonomyToolbar';

// Tables & Rows
import { TaxonomyTable } from './taxonomy/TaxonomyTable';
import { ItemTable } from './item/ItemTable';

// Drawers & Overlays
import { TaxonomyDrawer } from './drawer/TaxonomyDrawer';
import { ReviewDrawer } from './workflow/ReviewDrawer';
import { VersionHistoryDrawer } from './workflow/VersionHistoryDrawer';
import { PublishDialog } from './workflow/PublishDialog';

// Feedback & States
import { EmptyState } from './states/EmptyState';
import { NoResultsState } from './states/NoResultsState';
import { ToastContainer, ToastMessage } from './primitives/Toast';
import { ShieldAlert, BookOpen, Layers } from 'lucide-react';

export interface TaxonomiesPageProps {
  initialTaxonomies?: Taxonomy[];
  initialChanges?: TaxonomyChange[];
  initialHistory?: VersionHistoryEntry[];
  initialVersion?: string;
  initialRole?: PermissionRole;
}

export const TaxonomiesPage: React.FC<TaxonomiesPageProps> = ({
  initialTaxonomies = [],
  initialChanges = [],
  initialHistory = [],
  initialVersion = 'v1.4.2',
  initialRole = 'publisher',
}) => {
  // Domain state
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>(initialTaxonomies);
  const [changes, setChanges] = useState<TaxonomyChange[]>(initialChanges);
  const [history, setHistory] = useState<VersionHistoryEntry[]>(initialHistory);
  const [version, setVersion] = useState<string>(initialVersion);

  // User and permissions state
  const [currentRole, setCurrentRole] = useState<PermissionRole>(initialRole);
  const capabilities = useMemo(() => getCapabilities(currentRole), [currentRole]);

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('taxonomies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TaxonomyType | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string | 'ALL'>('ALL');

  // Overlay states
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<Taxonomy | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view');
  const [isTaxonomyDrawerOpen, setIsTaxonomyDrawerOpen] = useState(false);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  // Toast feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Derived collections
  const flattenedItems = useMemo(() => flattenItems(taxonomies), [taxonomies]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    taxonomies.forEach((t) => {
      t.items.forEach((item) => {
        if (item.categoryLabel) set.add(item.categoryLabel);
      });
    });
    return Array.from(set).sort();
  }, [taxonomies]);

  const filterState: FilterState = useMemo(
    () => ({
      searchQuery,
      selectedType,
      selectedCategory,
    }),
    [searchQuery, selectedType, selectedCategory]
  );

  const filteredTaxonomies = useMemo(
    () => filterTaxonomies(taxonomies, filterState),
    [taxonomies, filterState]
  );

  const filteredItems = useMemo(
    () => filterFlattenedItems(flattenedItems, filterState),
    [flattenedItems, filterState]
  );

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (selectedType !== 'ALL' ? 1 : 0) +
    (selectedCategory !== 'ALL' ? 1 : 0);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedCategory('ALL');
  };

  // Change queues
  const pendingChanges = useMemo(
    () => changes.filter((c) => c.status === 'pending'),
    [changes]
  );

  const acceptedChanges = useMemo(
    () => changes.filter((c) => c.status === 'accepted'),
    [changes]
  );

  // Handlers for Drawer Interactions
  const handleOpenTaxonomy = (tax: Taxonomy, mode: 'view' | 'edit' = 'view') => {
    setSelectedTaxonomy(tax);
    setDrawerMode(mode);
    setIsTaxonomyDrawerOpen(true);
  };

  const handleCreateTaxonomy = () => {
    setSelectedTaxonomy(null);
    setDrawerMode('edit');
    setIsTaxonomyDrawerOpen(true);
  };

  const handleOpenParentFromItem = (taxonomyId: string) => {
    const parent = taxonomies.find((t) => t.id === taxonomyId);
    if (parent) {
      handleOpenTaxonomy(parent, 'view');
    }
  };

  // Handlers for Saves & Submissions (Workflow Engine)
  const handleSaveTaxonomy = (input: TaxonomyInput, originalId?: string) => {
    const isNew = !originalId;

    if (isNew) {
      const newId = `tax-${Date.now()}`;
      const newTaxonomy: Taxonomy = {
        ...input,
        id: newId,
        metadata: {
          createdAt: new Date().toISOString(),
          createdBy: currentRole === 'publisher' ? 'Publisher' : 'Editor',
          updatedAt: new Date().toISOString(),
          updatedBy: currentRole === 'publisher' ? 'Publisher' : 'Editor',
        },
      };

      if (capabilities.canPublish) {
        // Publishers apply immediately and stage accepted change
        setTaxonomies((prev) => [newTaxonomy, ...prev]);
        const change: TaxonomyChange = {
          id: `chg-${Date.now()}`,
          taxonomyId: newId,
          taxonomyName: newTaxonomy.name,
          entityType: 'Taxonomy',
          action: 'create',
          summary: `Created taxonomy "${newTaxonomy.name}" (${newTaxonomy.type})`,
          after: newTaxonomy,
          authorId: 'current-user',
          authorName: 'Publisher User',
          timestamp: new Date().toISOString(),
          status: 'accepted',
          versionImpact: 'major',
        };
        setChanges((prev) => [change, ...prev]);
        addToast('success', 'Taxonomy Created', `"${newTaxonomy.name}" has been created and staged.`);
      } else {
        // Editor proposes change to pending queue
        const change: TaxonomyChange = {
          id: `chg-${Date.now()}`,
          taxonomyId: newId,
          taxonomyName: newTaxonomy.name,
          entityType: 'Taxonomy',
          action: 'create',
          summary: `Proposed new taxonomy "${newTaxonomy.name}" (${newTaxonomy.type})`,
          after: newTaxonomy,
          authorId: 'current-user',
          authorName: 'Editor User',
          timestamp: new Date().toISOString(),
          status: 'pending',
          versionImpact: 'major',
        };
        setChanges((prev) => [change, ...prev]);
        addToast(
          'info',
          'Proposal Submitted',
          `"${newTaxonomy.name}" has been placed in the pending review queue.`
        );
      }
    } else {
      // Existing taxonomy update
      const existing = taxonomies.find((t) => t.id === originalId);
      if (!existing) return;

      // Determine changes and version impact
      const nameChanged = existing.name !== input.name;
      const descChanged = existing.description !== input.description;
      const typeChanged = existing.type !== input.type;
      const itemsCountDiff = input.items.length - existing.items.length;

      let highestImpact: VersionImpact = 'patch';
      let changeSummary = `Updated taxonomy "${input.name}"`;

      if (typeChanged) {
        highestImpact = 'major';
        changeSummary = `Changed classification type from ${existing.type} to ${input.type}`;
      } else if (itemsCountDiff !== 0) {
        highestImpact = 'minor';
        changeSummary =
          itemsCountDiff > 0
            ? `Added ${itemsCountDiff} item(s) to "${input.name}"`
            : `Removed ${Math.abs(itemsCountDiff)} item(s) from "${input.name}"`;
      } else if (nameChanged) {
        highestImpact = 'patch';
        changeSummary = `Renamed taxonomy from "${existing.name}" to "${input.name}"`;
      } else if (descChanged) {
        highestImpact = 'patch';
        changeSummary = `Updated description on "${input.name}"`;
      }

      const updatedTaxonomy: Taxonomy = {
        ...existing,
        ...input,
        metadata: {
          ...existing.metadata,
          updatedAt: new Date().toISOString(),
          updatedBy: currentRole === 'publisher' ? 'Publisher' : 'Editor',
        },
      };

      if (capabilities.canPublish) {
        setTaxonomies((prev) =>
          prev.map((t) => (t.id === originalId ? updatedTaxonomy : t))
        );
        const change: TaxonomyChange = {
          id: `chg-${Date.now()}`,
          taxonomyId: originalId,
          taxonomyName: updatedTaxonomy.name,
          entityType: 'Taxonomy',
          action: 'update',
          summary: changeSummary,
          authorId: 'current-user',
          authorName: 'Publisher User',
          timestamp: new Date().toISOString(),
          status: 'accepted',
          versionImpact: highestImpact,
        };
        setChanges((prev) => [change, ...prev]);
        addToast('success', 'Changes Saved', `Updated "${updatedTaxonomy.name}". Staged as ${highestImpact} impact.`);
      } else {
        const change: TaxonomyChange = {
          id: `chg-${Date.now()}`,
          taxonomyId: originalId,
          taxonomyName: updatedTaxonomy.name,
          entityType: 'Taxonomy',
          action: 'update',
          summary: changeSummary,
          authorId: 'current-user',
          authorName: 'Editor User',
          timestamp: new Date().toISOString(),
          status: 'pending',
          versionImpact: highestImpact,
        };
        setChanges((prev) => [change, ...prev]);
        addToast(
          'info',
          'Proposal Staged',
          `Proposed changes to "${updatedTaxonomy.name}" sent to review queue.`
        );
      }
    }
  };

  const handleDeleteTaxonomy = (taxonomy: Taxonomy) => {
    if (!capabilities.canEdit) return;

    if (capabilities.canPublish) {
      setTaxonomies((prev) => prev.filter((t) => t.id !== taxonomy.id));
      const change: TaxonomyChange = {
        id: `chg-${Date.now()}`,
        taxonomyId: taxonomy.id,
        taxonomyName: taxonomy.name,
        entityType: 'Taxonomy',
        action: 'remove',
        summary: `Deleted taxonomy "${taxonomy.name}"`,
        authorId: 'current-user',
        authorName: 'Publisher User',
        timestamp: new Date().toISOString(),
        status: 'accepted',
        versionImpact: 'major',
      };
      setChanges((prev) => [change, ...prev]);
      addToast('success', 'Taxonomy Deleted', `"${taxonomy.name}" removed. Staged as major change.`);
    } else {
      const change: TaxonomyChange = {
        id: `chg-${Date.now()}`,
        taxonomyId: taxonomy.id,
        taxonomyName: taxonomy.name,
        entityType: 'Taxonomy',
        action: 'remove',
        summary: `Proposed deletion of taxonomy "${taxonomy.name}"`,
        authorId: 'current-user',
        authorName: 'Editor User',
        timestamp: new Date().toISOString(),
        status: 'pending',
        versionImpact: 'major',
      };
      setChanges((prev) => [change, ...prev]);
      addToast('info', 'Deletion Proposed', `Deletion proposal for "${taxonomy.name}" queued for review.`);
    }
  };

  // Review actions
  const handleAcceptChange = (changeId: string) => {
    setChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, status: 'accepted' as const } : c))
    );
    addToast('success', 'Change Accepted', 'The proposal has been approved and added to the pending release batch.');
  };

  const handleRejectChange = (changeId: string) => {
    setChanges((prev) => prev.filter((c) => c.id !== changeId));
    addToast('info', 'Change Rejected', 'The proposal was removed from the review queue.');
  };

  // Publish batch
  const handleConfirmPublish = (
    newVersion: string,
    releaseSummary: string,
    impact: VersionImpact
  ) => {
    const entry: VersionHistoryEntry = {
      id: `vh-${Date.now()}`,
      version: newVersion,
      publishedAt: new Date().toISOString(),
      publishedBy: 'Publisher User',
      summary: releaseSummary,
      impact,
      changesCount: acceptedChanges.length,
      changes: acceptedChanges.map((c) => ({
        id: c.id,
        summary: c.summary,
        authorName: c.authorName,
        versionImpact: c.versionImpact,
      })),
    };

    setHistory((prev) => [entry, ...prev]);
    setVersion(newVersion);
    // Clear published accepted changes
    setChanges((prev) => prev.filter((c) => c.status !== 'accepted'));
    addToast('success', 'Release Published', `Successfully published version ${newVersion}!`);
  };

  // No Access view
  if (!capabilities.canView) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--surface-canvas)]">
        <PageHeader
          version={version}
          unpublishedCount={0}
          pendingCount={0}
          currentRole={currentRole}
          capabilities={capabilities}
          onRoleChange={setCurrentRole}
          onOpenReview={() => {}}
          onOpenHistory={() => {}}
          onOpenPublish={() => {}}
        />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md p-8 bg-[var(--surface-raised)] rounded-xl border border-[var(--border-subtle)] text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[var(--palette-rose-50)] text-[var(--palette-rose-600)] flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[var(--text-primary)] font-display">
              Access Restricted
            </h2>
            <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              You do not have permission to view or manage Tuteria educational taxonomies. Please switch your role using the selector in the header.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {/* Toast Feedback notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Global Header */}
      <PageHeader
        version={version}
        unpublishedCount={acceptedChanges.length}
        pendingCount={pendingChanges.length}
        currentRole={currentRole}
        capabilities={capabilities}
        onRoleChange={setCurrentRole}
        onOpenReview={() => setIsReviewDrawerOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenPublish={() => setIsPublishDialogOpen(true)}
      />

      {/* Two-Tab Navigation */}
      <TaxonomyTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        taxonomiesCount={taxonomies.length}
        itemsCount={flattenedItems.length}
      />

      {/* Search and Filters Toolbar */}
      <TaxonomyToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        availableCategories={availableCategories}
        capabilities={capabilities}
        onCreateNew={handleCreateTaxonomy}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Table Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'taxonomies' ? (
          <div>
            {taxonomies.length === 0 ? (
              <EmptyState
                title="No taxonomies configured"
                description="Get started by creating your first educational taxonomy structure to categorize levels, terms, or curriculum goals."
                actionLabel="Create Taxonomy"
                onAction={capabilities.canEdit ? handleCreateTaxonomy : undefined}
              />
            ) : filteredTaxonomies.length === 0 ? (
              <NoResultsState
                searchQuery={searchQuery}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1">
                  <span>
                    Showing {filteredTaxonomies.length} of {taxonomies.length} taxonomies
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="font-medium text-[var(--palette-blue-700)]">
                      Filtered by {activeFilterCount} criteria
                    </span>
                  )}
                </div>

                <TaxonomyTable
                  taxonomies={filteredTaxonomies}
                  capabilities={capabilities}
                  onSelectTaxonomy={(t) => handleOpenTaxonomy(t, 'view')}
                  onEditTaxonomy={(t) => handleOpenTaxonomy(t, 'edit')}
                  onDeleteTaxonomy={handleDeleteTaxonomy}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            {flattenedItems.length === 0 ? (
              <EmptyState
                title="No taxonomy items created"
                description="Taxonomies must contain educational items, grade levels, or exam targets to display in this list."
                actionLabel="Add Taxonomy Items"
                icon={<BookOpen className="w-6 h-6" />}
                onAction={
                  taxonomies.length > 0 && capabilities.canEdit
                    ? () => handleOpenTaxonomy(taxonomies[0], 'edit')
                    : undefined
                }
              />
            ) : filteredItems.length === 0 ? (
              <NoResultsState
                searchQuery={searchQuery}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1">
                  <span>
                    Showing {filteredItems.length} of {flattenedItems.length} items across all taxonomies
                  </span>
                </div>

                <ItemTable
                  items={filteredItems}
                  capabilities={capabilities}
                  onOpenParentTaxonomy={handleOpenParentFromItem}
                  onEditItem={(item) => {
                    const parent = taxonomies.find((t) => t.id === item.taxonomyId);
                    if (parent) handleOpenTaxonomy(parent, 'edit');
                  }}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Overlay Layers: Taxonomy Drawer */}
      <TaxonomyDrawer
        isOpen={isTaxonomyDrawerOpen}
        onClose={() => setIsTaxonomyDrawerOpen(false)}
        taxonomy={selectedTaxonomy}
        capabilities={capabilities}
        initialMode={drawerMode}
        onSave={handleSaveTaxonomy}
      />

      {/* Changes Review Drawer */}
      <ReviewDrawer
        isOpen={isReviewDrawerOpen}
        onClose={() => setIsReviewDrawerOpen(false)}
        pendingChanges={pendingChanges}
        acceptedChanges={acceptedChanges}
        capabilities={capabilities}
        onAcceptChange={handleAcceptChange}
        onRejectChange={handleRejectChange}
        onOpenPublish={() => setIsPublishDialogOpen(true)}
      />

      {/* Version History Drawer */}
      <VersionHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={history}
      />

      {/* Publish Batch Dialog */}
      <PublishDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        currentVersion={version}
        acceptedChanges={acceptedChanges}
        onConfirmPublish={handleConfirmPublish}
      />
    </div>
  );
};
