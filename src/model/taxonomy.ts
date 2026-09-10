/**
 * Domain types for Tuteria Taxonomies System
 * Specification: Section 7 & 8 of assessment
 */

export type TaxonomyType =
  | 'Levels'
  | 'Terms'
  | 'Learning Systems'
  | 'Learning Goals'
  | 'Exam Boards'
  | 'Skills';

export const TAXONOMY_TYPES: TaxonomyType[] = [
  'Levels',
  'Terms',
  'Learning Systems',
  'Learning Goals',
  'Exam Boards',
  'Skills',
];

export interface RegionVariant {
  regionCode: string;
  regionName: string;
  value: string;
}

export interface TaxonomyItem {
  id: string;
  taxonomyId: string;
  name: string;
  categoryId?: string;
  categoryLabel?: string;
  regionVariants: RegionVariant[];
  sortOrder?: number;
}

export interface TaxonomyMetadata {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Taxonomy {
  id: string;
  name: string;
  type: TaxonomyType;
  description: string;
  source: string;
  programRefs: string[];
  sortable: boolean;
  items: TaxonomyItem[];
  metadata: TaxonomyMetadata;
}

export interface TaxonomyInput {
  name: string;
  type: TaxonomyType;
  description: string;
  source: string;
  programRefs: string[];
  sortable: boolean;
  items: TaxonomyItem[];
}

/**
 * Separate UI / Draft State
 * Keeps transient edit states isolated from domain canonical records
 */
export interface TaxonomyDraft {
  taxonomyId?: string; // empty if creating new
  values: TaxonomyInput;
  dirty: boolean;
  validationErrors: Record<string, string>;
}

export interface FlattenedItemView extends TaxonomyItem {
  taxonomyName: string;
  taxonomyType: TaxonomyType;
}
