/**
 * Workflow and Change Model
 * Specification: Sections 5.1, 9, 11 of assessment
 */

export type ChangeStatus = 'pending' | 'accepted';

export type VersionImpact = 'patch' | 'minor' | 'major';

export interface TaxonomyChange {
  id: string;
  taxonomyId: string;
  taxonomyName: string;
  entityType: 'Taxonomy' | 'Item';
  action: 'create' | 'update' | 'remove';
  field?: string; // e.g. 'name', 'description', 'type', 'item'
  summary: string;
  before?: unknown;
  after?: unknown;
  authorId: string;
  authorName: string;
  timestamp: string;
  status: ChangeStatus;
  versionImpact: VersionImpact;
}

/**
 * Pure function to determine version impact based strictly on assessment rules:
 * - Taxonomy name change -> patch
 * - Taxonomy description change -> patch
 * - Add item -> minor
 * - Remove item -> minor
 * - Add taxonomy -> major
 * - Remove taxonomy -> major
 * Reasonable Engineering Assumptions (Documented in NOTES.md):
 * - Taxonomy type change -> major (fundamental structural reclassification)
 * - Item name or properties update -> patch
 */
export function getVersionImpact(change: {
  entityType: 'Taxonomy' | 'Item';
  action: 'create' | 'update' | 'remove';
  field?: string;
}): VersionImpact {
  if (change.entityType === 'Taxonomy') {
    if (change.action === 'create' || change.action === 'remove') {
      return 'major';
    }
    if (change.action === 'update') {
      if (change.field === 'name' || change.field === 'description') {
        return 'patch';
      }
      if (change.field === 'type') {
        return 'major'; // explicit engineering assumption
      }
      return 'patch';
    }
  }

  if (change.entityType === 'Item') {
    if (change.action === 'create' || change.action === 'remove') {
      return 'minor';
    }
    if (change.action === 'update') {
      return 'patch';
    }
  }

  return 'patch';
}
