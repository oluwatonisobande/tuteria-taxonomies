import type { Meta, StoryObj } from '@storybook/react';
import { TaxonomyTable } from '../components/taxonomy/TaxonomyTable';
import { CANONICAL_TAXONOMIES } from '../data/fixtures';
import { getCapabilities } from '../model/permissions';

const meta: Meta<typeof TaxonomyTable> = {
  title: 'Components / Taxonomy / TaxonomyTable',
  component: TaxonomyTable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof TaxonomyTable>;

export const Populated: Story = {
  args: {
    taxonomies: CANONICAL_TAXONOMIES,
    capabilities: getCapabilities('publisher'),
    onSelectTaxonomy: (tax) => console.log('Select:', tax.name),
    onEditTaxonomy: (tax) => console.log('Edit:', tax.name),
    onDeleteTaxonomy: (tax) => console.log('Delete:', tax.name),
  },
};

export const ViewOnlyMode: Story = {
  args: {
    taxonomies: CANONICAL_TAXONOMIES,
    capabilities: getCapabilities('view_only'),
    onSelectTaxonomy: (tax) => console.log('Select:', tax.name),
  },
};

export const SingleTaxonomy: Story = {
  args: {
    taxonomies: [CANONICAL_TAXONOMIES[0]],
    capabilities: getCapabilities('publisher'),
    onSelectTaxonomy: (tax) => console.log('Select:', tax.name),
  },
};
