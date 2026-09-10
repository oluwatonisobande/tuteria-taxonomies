import { describe, it, expect } from 'vitest';
import { getVersionImpact } from './changes';
import { bumpVersion, getHighestImpact, parseSemver, formatSemver } from './versioning';
import { getCapabilities } from './permissions';
import { validateTaxonomy, validateTaxonomyItem } from '../utils/validation';
import { filterTaxonomies, flattenItems, filterFlattenedItems } from '../utils/filtering';
import { CANONICAL_TAXONOMIES } from '../data/fixtures';

describe('Version Impact Rules (PDF & Case Study Spec)', () => {
  it('assigns patch impact to taxonomy name changes', () => {
    expect(
      getVersionImpact({
        entityType: 'Taxonomy',
        action: 'update',
        field: 'name',
      })
    ).toBe('patch');
  });

  it('assigns patch impact to taxonomy description changes', () => {
    expect(
      getVersionImpact({
        entityType: 'Taxonomy',
        action: 'update',
        field: 'description',
      })
    ).toBe('patch');
  });

  it('assigns minor impact to adding an item', () => {
    expect(
      getVersionImpact({
        entityType: 'Item',
        action: 'create',
      })
    ).toBe('minor');
  });

  it('assigns minor impact to removing an item', () => {
    expect(
      getVersionImpact({
        entityType: 'Item',
        action: 'remove',
      })
    ).toBe('minor');
  });

  it('assigns major impact to adding a taxonomy', () => {
    expect(
      getVersionImpact({
        entityType: 'Taxonomy',
        action: 'create',
      })
    ).toBe('major');
  });

  it('assigns major impact to removing a taxonomy', () => {
    expect(
      getVersionImpact({
        entityType: 'Taxonomy',
        action: 'remove',
      })
    ).toBe('major');
  });

  it('assigns major impact to changing taxonomy type (documented engineering assumption)', () => {
    expect(
      getVersionImpact({
        entityType: 'Taxonomy',
        action: 'update',
        field: 'type',
      })
    ).toBe('major');
  });
});

describe('Semantic Versioning Calculations', () => {
  it('correctly bumps patch versions', () => {
    const semver = { major: 1, minor: 4, patch: 2 };
    expect(bumpVersion(semver, 'patch')).toEqual({ major: 1, minor: 4, patch: 3 });
  });

  it('correctly bumps minor versions and resets patch', () => {
    const semver = { major: 1, minor: 4, patch: 2 };
    expect(bumpVersion(semver, 'minor')).toEqual({ major: 1, minor: 5, patch: 0 });
  });

  it('correctly bumps major versions and resets minor & patch', () => {
    const semver = { major: 1, minor: 4, patch: 2 };
    expect(bumpVersion(semver, 'major')).toEqual({ major: 2, minor: 0, patch: 0 });
  });

  it('determines highest impact from a batch', () => {
    expect(getHighestImpact(['patch', 'patch'])).toBe('patch');
    expect(getHighestImpact(['patch', 'minor', 'patch'])).toBe('minor');
    expect(getHighestImpact(['patch', 'major', 'minor'])).toBe('major');
  });

  it('parses and formats semver strings accurately', () => {
    const parsed = parseSemver('v2.5.1');
    expect(parsed).toEqual({ major: 2, minor: 5, patch: 1 });
    expect(formatSemver(parsed)).toBe('v2.5.1');
    expect(formatSemver(parsed, false)).toBe('2.5.1');
  });
});

describe('Permission Capabilities', () => {
  it('restricts no_access completely', () => {
    expect(getCapabilities('no_access')).toEqual({
      canView: false,
      canEdit: false,
      canReview: false,
      canPublish: false,
    });
  });

  it('allows view_only to view without editing, reviewing, or publishing', () => {
    expect(getCapabilities('view_only')).toEqual({
      canView: true,
      canEdit: false,
      canReview: false,
      canPublish: false,
    });
  });

  it('allows editor to view and edit, but not review or publish', () => {
    expect(getCapabilities('editor')).toEqual({
      canView: true,
      canEdit: true,
      canReview: false,
      canPublish: false,
    });
  });

  it('allows publisher full capabilities', () => {
    expect(getCapabilities('publisher')).toEqual({
      canView: true,
      canEdit: true,
      canReview: true,
      canPublish: true,
    });
  });
});

describe('Validation Engine', () => {
  it('validates taxonomy requirements', () => {
    const invalid = validateTaxonomy({
      name: '',
      type: 'Levels',
      description: '',
      source: '',
      programRefs: [],
      sortable: false,
      items: [],
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.name).toBeDefined();

    const valid = validateTaxonomy({
      name: 'Higher Secondary',
      type: 'Levels',
      description: 'Senior grade level definitions',
      source: 'Curriculum standard',
      programRefs: [],
      sortable: false,
      items: [],
    });
    expect(valid.isValid).toBe(true);
    expect(Object.keys(valid.errors).length).toBe(0);
  });

  it('validates item name requirements', () => {
    expect(validateTaxonomyItem({ name: '' }).isValid).toBe(false);
    expect(validateTaxonomyItem({ name: 'Grade 10' }).isValid).toBe(true);
  });
});

describe('Filtering & Item Derivation', () => {
  it('flattens items while maintaining parent taxonomy references', () => {
    const flattened = flattenItems(CANONICAL_TAXONOMIES);
    expect(flattened.length).toBeGreaterThan(0);
    const firstItem = flattened[0];
    expect(firstItem.taxonomyName).toBeDefined();
    expect(firstItem.taxonomyType).toBeDefined();
  });

  it('filters taxonomies by search query', () => {
    const results = filterTaxonomies(CANONICAL_TAXONOMIES, {
      searchQuery: 'Cambridge',
      selectedType: 'ALL',
      selectedCategory: 'ALL',
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.id === 'tax-boards')).toBe(true);
  });
});
