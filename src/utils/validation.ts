/**
 * Validation Engine
 * Specification: Section 20 of assessment
 */

import { TaxonomyInput, TaxonomyItem } from '../model/taxonomy';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateTaxonomy(input: TaxonomyInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length === 0) {
    errors.name = 'Taxonomy name is required.';
  } else if (input.name.trim().length < 2) {
    errors.name = 'Taxonomy name must be at least 2 characters.';
  }

  if (!input.type) {
    errors.type = 'Taxonomy type is required.';
  }

  if (input.description && input.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateTaxonomyItem(item: Partial<TaxonomyItem>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!item.name || item.name.trim().length === 0) {
    errors.name = 'Item name is required.';
  } else if (item.name.trim().length < 2) {
    errors.name = 'Item name must be at least 2 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
