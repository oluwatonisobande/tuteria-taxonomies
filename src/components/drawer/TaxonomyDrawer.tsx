import React, { useState, useEffect } from 'react';
import { Taxonomy, TaxonomyInput, TaxonomyType, TAXONOMY_TYPES, TaxonomyItem } from '../../model/taxonomy';
import { Drawer } from '../primitives/Drawer';
import { Button } from '../primitives/Button';
import { Dialog } from '../primitives/Dialog';
import { ItemEditorRow } from './ItemEditorRow';
import { TypePill } from '../primitives/TypePill';
import { validateTaxonomy } from '../../utils/validation';
import { PermissionCapabilities } from '../../model/permissions';
import { Plus, Clock, User, ShieldAlert, AlertCircle, Sparkles } from 'lucide-react';

export interface TaxonomyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  taxonomy: Taxonomy | null; // null means "Create New"
  capabilities: PermissionCapabilities;
  onSave: (taxonomyInput: TaxonomyInput, originalId?: string) => void;
  initialMode?: 'view' | 'edit';
}

export const TaxonomyDrawer: React.FC<TaxonomyDrawerProps> = ({
  isOpen,
  onClose,
  taxonomy,
  capabilities,
  onSave,
  initialMode = 'view',
}) => {
  const isCreateMode = !taxonomy;
  const [isEditing, setIsEditing] = useState<boolean>(isCreateMode || initialMode === 'edit');
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);

  // Draft state (Section 8: Separate domain data from UI/draft state)
  const [formData, setFormData] = useState<TaxonomyInput>({
    name: '',
    type: 'Levels',
    description: '',
    source: '',
    programRefs: [],
    sortable: false,
    items: [],
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [newProgramInput, setNewProgramInput] = useState('');

  // Sync state when taxonomy or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (taxonomy) {
        setFormData({
          name: taxonomy.name,
          type: taxonomy.type,
          description: taxonomy.description,
          source: taxonomy.source,
          programRefs: [...taxonomy.programRefs],
          sortable: taxonomy.sortable,
          items: JSON.parse(JSON.stringify(taxonomy.items)),
        });
        setIsEditing(initialMode === 'edit' && capabilities.canEdit);
      } else {
        // Create new
        setFormData({
          name: '',
          type: 'Levels',
          description: '',
          source: '',
          programRefs: [],
          sortable: false,
          items: [],
        });
        setIsEditing(true);
      }
      setIsDirty(false);
      setValidationErrors({});
    }
  }, [isOpen, taxonomy, initialMode, capabilities.canEdit]);

  const handleFieldChange = <K extends keyof TaxonomyInput>(field: K, value: TaxonomyInput[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleAddItem = () => {
    const newItem: TaxonomyItem = {
      id: `item-${Date.now()}`,
      taxonomyId: taxonomy ? taxonomy.id : 'tax-temp',
      name: '',
      sortOrder: formData.items.length + 1,
      regionVariants: [],
    };
    handleFieldChange('items', [...formData.items, newItem]);
  };

  const handleUpdateItem = (index: number, updatedItem: TaxonomyItem) => {
    const updated = [...formData.items];
    updated[index] = updatedItem;
    handleFieldChange('items', updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = formData.items.filter((_, idx) => idx !== index);
    handleFieldChange('items', updated);
  };

  const handleMoveItem = (fromIdx: number, toIdx: number) => {
    const updated = [...formData.items];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    handleFieldChange('items', updated);
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgramInput.trim()) return;
    if (!formData.programRefs.includes(newProgramInput.trim())) {
      handleFieldChange('programRefs', [...formData.programRefs, newProgramInput.trim()]);
    }
    setNewProgramInput('');
  };

  const handleRemoveProgram = (prog: string) => {
    handleFieldChange(
      'programRefs',
      formData.programRefs.filter((p) => p !== prog)
    );
  };

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowUnsavedConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowUnsavedConfirm(false);
    setIsDirty(false);
    onClose();
  };

  const handleSave = () => {
    const validation = validateTaxonomy(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    onSave(formData, taxonomy ? taxonomy.id : undefined);
    setIsDirty(false);
    onClose();
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={handleAttemptClose}
        title={
          isCreateMode
            ? 'Create Taxonomy'
            : isEditing
            ? `Edit: ${taxonomy?.name}`
            : taxonomy?.name || 'Taxonomy Details'
        }
        subtitle={
          isCreateMode
            ? 'Define a new curriculum taxonomy category, hierarchy, and items.'
            : isEditing
            ? 'Modifications will be staged and submitted for versioned review.'
            : 'View canonical taxonomy configuration, items, and regional variations.'
        }
        width="max-w-2xl"
        footer={
          isEditing ? (
            <>
              <Button variant="secondary" onClick={handleAttemptClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                icon={capabilities.canPublish ? undefined : <Sparkles className="w-4 h-4" />}
              >
                {isCreateMode
                  ? 'Create Taxonomy'
                  : capabilities.canPublish
                  ? 'Save Changes'
                  : 'Propose Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              {capabilities.canEdit && (
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Taxonomy
                </Button>
              )}
            </>
          )
        }
      >
        <div className="space-y-6">
          {/* Read-Only Capability Notice for View Only */}
          {!capabilities.canEdit && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[var(--palette-amber-50)] text-[var(--palette-amber-700)] text-xs border border-[var(--palette-amber-100)]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>You have read-only access. You can inspect taxonomy structures and regional variants, but cannot stage edits.</span>
            </div>
          )}

          {/* Identity & Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Taxonomy Identity
            </h3>

            {/* Name */}
            <div>
              <label
                htmlFor="taxonomy-name-input"
                className="block text-xs font-medium text-[var(--text-primary)] mb-1"
              >
                Taxonomy Name <span className="text-[var(--palette-rose-600)]">*</span>
              </label>
              {isEditing ? (
                <div>
                  <input
                    id="taxonomy-name-input"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="e.g. Academic Levels & Grades"
                    className={`w-full text-sm px-3 py-2 rounded-lg border bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:ring-1 ${
                      validationErrors.name
                        ? 'border-[var(--palette-rose-600)] focus:ring-[var(--palette-rose-600)]'
                        : 'border-[var(--border-subtle)] focus:border-[var(--border-focus)] focus:ring-[var(--border-focus)]'
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-xs text-[var(--palette-rose-600)] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{validationErrors.name}</span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {formData.name}
                </p>
              )}
            </div>

            {/* Type & Sortable grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="taxonomy-type-select"
                  className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                >
                  Type
                </label>
                {isEditing ? (
                  <select
                    id="taxonomy-type-select"
                    value={formData.type}
                    onChange={(e) =>
                      handleFieldChange('type', e.target.value as TaxonomyType)
                    }
                    className="w-full text-sm px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
                  >
                    {TAXONOMY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-1">
                    <TypePill type={formData.type} size="md" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                  Ordering Configuration
                </label>
                {isEditing ? (
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sortable}
                      onChange={(e) => handleFieldChange('sortable', e.target.checked)}
                      className="rounded border-[var(--border-subtle)] text-[var(--palette-blue-700)] focus:ring-[var(--palette-blue-700)]"
                    />
                    <span className="text-xs text-[var(--text-secondary)]">
                      Items in this taxonomy have fixed sequential order
                    </span>
                  </label>
                ) : (
                  <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                    {formData.sortable ? 'Sequentially Ordered' : 'Unordered / Arbitrary'}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="taxonomy-desc-input"
                className="block text-xs font-medium text-[var(--text-primary)] mb-1"
              >
                Description
              </label>
              {isEditing ? (
                <textarea
                  id="taxonomy-desc-input"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Explain what this taxonomy represents and how it should be applied..."
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
                />
              ) : (
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {formData.description || 'No description provided.'}
                </p>
              )}
            </div>

            {/* Source */}
            <div>
              <label
                htmlFor="taxonomy-source-input"
                className="block text-xs font-medium text-[var(--text-primary)] mb-1"
              >
                Source Authority / Curriculum Registry
              </label>
              {isEditing ? (
                <input
                  id="taxonomy-source-input"
                  type="text"
                  value={formData.source}
                  onChange={(e) => handleFieldChange('source', e.target.value)}
                  placeholder="e.g. Tuteria Academic Registry v2"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
                />
              ) : (
                <p className="text-xs text-[var(--text-secondary)]">
                  {formData.source || '—'}
                </p>
              )}
            </div>
          </div>

          {/* Program References */}
          <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Associated Programs ({formData.programRefs.length})
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {formData.programRefs.map((prog) => (
                <span
                  key={prog}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                >
                  <span>{prog}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProgram(prog)}
                      className="text-[var(--text-tertiary)] hover:text-[var(--palette-rose-600)] p-0.5"
                    >
                      &times;
                    </button>
                  )}
                </span>
              ))}
              {formData.programRefs.length === 0 && (
                <span className="text-xs text-[var(--text-muted)] italic">
                  Not linked to any specific programs.
                </span>
              )}
            </div>

            {isEditing && (
              <form onSubmit={handleAddProgram} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newProgramInput}
                  onChange={(e) => setNewProgramInput(e.target.value)}
                  placeholder="Link a program (e.g. Exam Prep Academy)..."
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  disabled={!newProgramInput.trim()}
                >
                  Add Program
                </Button>
              </form>
            )}
          </div>

          {/* Taxonomy Items Editor / Viewer */}
          <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Taxonomy Items ({formData.items.length})
              </h3>
              {isEditing && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={handleAddItem}
                >
                  Add Item
                </Button>
              )}
            </div>

            {formData.items.length === 0 ? (
              <div className="p-6 text-center rounded-lg border border-dashed border-[var(--border-medium)] bg-[var(--surface-sunken)]">
                <p className="text-xs text-[var(--text-secondary)]">
                  This taxonomy currently contains no items.
                </p>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={handleAddItem}
                  >
                    Add first item
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {formData.items.map((item, idx) => (
                  <ItemEditorRow
                    key={item.id}
                    item={item}
                    index={idx}
                    totalItems={formData.items.length}
                    isEditable={isEditing}
                    onUpdate={(updated) => handleUpdateItem(idx, updated)}
                    onRemove={() => handleRemoveItem(idx)}
                    onMoveUp={() => handleMoveItem(idx, idx - 1)}
                    onMoveDown={() => handleMoveItem(idx, idx - 1)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Audit Metadata (if existing taxonomy) */}
          {taxonomy && taxonomy.metadata && (
            <div className="pt-4 border-t border-[var(--border-subtle)] bg-[var(--surface-sunken)] p-3 rounded-lg text-[11px] text-[var(--text-tertiary)] space-y-1 font-mono">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Created by {taxonomy.metadata.createdBy}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />{' '}
                  {new Date(taxonomy.metadata.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Updated by {taxonomy.metadata.updatedBy}</span>
                <span>{new Date(taxonomy.metadata.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </Drawer>

      {/* Unsaved Changes Guard Dialog */}
      <Dialog
        isOpen={showUnsavedConfirm}
        onClose={() => setShowUnsavedConfirm(false)}
        title="Unsaved Changes"
        description="You have unstaged modifications in this taxonomy draft. Navigating away will discard your changes. Do you want to discard them?"
        confirmLabel="Discard Changes"
        cancelLabel="Keep Editing"
        variant="danger"
        onConfirm={handleConfirmDiscard}
      />
    </>
  );
};
