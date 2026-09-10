import type { Meta, StoryObj } from '@storybook/react';
import { ItemTable } from '../components/item/ItemTable';
import { flattenItems } from '../utils/filtering';
import { CANONICAL_TAXONOMIES } from '../data/fixtures';
import { getCapabilities } from '../model/permissions';

const allItems = flattenItems(CANONICAL_TAXONOMIES);

const meta: Meta<typeof ItemTable> = {
  title: 'Components / Item / ItemTable',
  component: ItemTable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ItemTable>;

export const Populated: Story = {
  args: {
    items: allItems,
    capabilities: getCapabilities('publisher'),
    onOpenParentTaxonomy: (taxId) => console.log('Open parent taxonomy:', taxId),
    onEditItem: (item) => console.log('Edit item:', item.name),
  },
};

export const ViewOnlyMode: Story = {
  args: {
    items: allItems.slice(0, 5),
    capabilities: getCapabilities('view_only'),
    onOpenParentTaxonomy: (taxId) => console.log('Open parent taxonomy:', taxId),
  },
};
