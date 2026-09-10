/**
 * Filtering and Selectors
 * Specification: Sections 15, 16, 17 of assessment
 */

import { Taxonomy, FlattenedItemView, TaxonomyType } from '../model/taxonomy';

export interface FilterState {
  searchQuery: string;
  selectedType: TaxonomyType | 'ALL';
  selectedCategory: string | 'ALL';
}

export function filterTaxonomies(
  taxonomies: Taxonomy[],
  filters: FilterState
): Taxonomy[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return taxonomies.filter((tax) => {
    // Type filter
    if (filters.selectedType !== 'ALL' && tax.type !== filters.selectedType) {
      return false;
    }

    // Category filter
    if (filters.selectedCategory !== 'ALL') {
      const hasCategory = tax.items.some(
        (item) => item.categoryLabel === filters.selectedCategory
      );
      if (!hasCategory) return false;
    }

    // Search query filter
    if (query) {
      const matchesName = tax.name.toLowerCase().includes(query);
      const matchesDesc = tax.description.toLowerCase().includes(query);
      const matchesType = tax.type.toLowerCase().includes(query);
      const matchesSource = tax.source.toLowerCase().includes(query);
      const matchesProgram = tax.programRefs.some((p) =>
        p.toLowerCase().includes(query)
      );
      const matchesItems = tax.items.some(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.regionVariants.some(
            (rv) =>
              rv.value.toLowerCase().includes(query) ||
              rv.regionName.toLowerCase().includes(query)
          )
      );

      if (
        !matchesName &&
        !matchesDesc &&
        !matchesType &&
        !matchesSource &&
        !matchesProgram &&
        !matchesItems
      ) {
        return false;
      }
    }

    return true;
  });
}

export function flattenItems(taxonomies: Taxonomy[]): FlattenedItemView[] {
  const items: FlattenedItemView[] = [];
  for (const tax of taxonomies) {
    for (const item of tax.items) {
      items.push({
        ...item,
        taxonomyName: tax.name,
        taxonomyType: tax.type,
      });
    }
  }
  return items;
}

export function filterFlattenedItems(
  items: FlattenedItemView[],
  filters: FilterState
): FlattenedItemView[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    if (filters.selectedType !== 'ALL' && item.taxonomyType !== filters.selectedType) {
      return false;
    }

    if (
      filters.selectedCategory !== 'ALL' &&
      item.categoryLabel !== filters.selectedCategory
    ) {
      return false;
    }

    if (query) {
      const matchesName = item.name.toLowerCase().includes(query);
      const matchesCategory =
        item.categoryLabel && item.categoryLabel.toLowerCase().includes(query);
      const matchesTaxonomy = item.taxonomyName.toLowerCase().includes(query);
      const matchesVariants = item.regionVariants.some((rv) =>
        rv.value.toLowerCase().includes(query) || rv.regionName.toLowerCase().includes(query)
      );

      if (!matchesName && !matchesCategory && !matchesTaxonomy && !matchesVariants) {
        return false;
      }
    }

    return true;
  });
}
