import type { Meta, StoryObj } from '@storybook/react';
import { TaxonomiesPage } from '../components/TaxonomiesPage';
import {
  CANONICAL_TAXONOMIES,
  CANONICAL_CHANGES,
  CANONICAL_VERSION_HISTORY,
  CANONICAL_VERSION,
} from '../data/fixtures';

const meta: Meta<typeof TaxonomiesPage> = {
  title: 'Pages / TaxonomiesPage',
  component: TaxonomiesPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof TaxonomiesPage>;

export const DefaultPublisher: Story = {
  args: {
    initialTaxonomies: CANONICAL_TAXONOMIES,
    initialChanges: CANONICAL_CHANGES,
    initialHistory: CANONICAL_VERSION_HISTORY,
    initialVersion: CANONICAL_VERSION,
    initialRole: 'publisher',
  },
};

export const EditorRole: Story = {
  args: {
    initialTaxonomies: CANONICAL_TAXONOMIES,
    initialChanges: CANONICAL_CHANGES,
    initialHistory: CANONICAL_VERSION_HISTORY,
    initialVersion: CANONICAL_VERSION,
    initialRole: 'editor',
  },
};

export const ViewOnlyRole: Story = {
  args: {
    initialTaxonomies: CANONICAL_TAXONOMIES,
    initialChanges: CANONICAL_CHANGES,
    initialHistory: CANONICAL_VERSION_HISTORY,
    initialVersion: CANONICAL_VERSION,
    initialRole: 'view_only',
  },
};

export const NoAccessRestricted: Story = {
  args: {
    initialTaxonomies: CANONICAL_TAXONOMIES,
    initialChanges: [],
    initialHistory: [],
    initialVersion: CANONICAL_VERSION,
    initialRole: 'no_access',
  },
};

export const EmptyStateNoTaxonomies: Story = {
  args: {
    initialTaxonomies: [],
    initialChanges: [],
    initialHistory: CANONICAL_VERSION_HISTORY,
    initialVersion: 'v1.0.0',
    initialRole: 'publisher',
  },
};
