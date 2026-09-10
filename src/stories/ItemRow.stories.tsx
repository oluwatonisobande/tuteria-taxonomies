import type { Meta, StoryObj } from '@storybook/react';
import { ItemRow } from '../components/item/ItemRow';
import { flattenItems } from '../utils/filtering';
import { CANONICAL_TAXONOMIES } from '../data/fixtures';
import { getCapabilities } from '../model/permissions';

const allItems = flattenItems(CANONICAL_TAXONOMIES);

const meta: Meta<typeof ItemRow> = {
  title: 'Components / Item / ItemRow',
  component: ItemRow,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="bg-white p-4 rounded-xl border border-neutral-200">
        <table className="w-full text-left">
          <tbody>
            <Story />
          </tbody>
        </table>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ItemRow>;

export const DefaultItem: Story = {
  args: {
    item: allItems[0], // Primary 1
    capabilities: getCapabilities('publisher'),
    onOpenParentTaxonomy: (taxId) => console.log('Open taxonomy:', taxId),
    onEditItem: (item) => console.log('Edit item:', item.name),
  },
};

export const ItemWithMultipleRegions: Story = {
  args: {
    item: allItems.find((i) => i.regionVariants.length > 1) || allItems[1],
    capabilities: getCapabilities('publisher'),
    onOpenParentTaxonomy: (taxId) => console.log('Open taxonomy:', taxId),
  },
};
