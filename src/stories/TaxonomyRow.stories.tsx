import type { Meta, StoryObj } from '@storybook/react';
import { TaxonomyRow } from '../components/taxonomy/TaxonomyRow';
import { CANONICAL_TAXONOMIES } from '../data/fixtures';
import { getCapabilities } from '../model/permissions';

const meta: Meta<typeof TaxonomyRow> = {
  title: 'Components / Taxonomy / TaxonomyRow',
  component: TaxonomyRow,
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
type Story = StoryObj<typeof TaxonomyRow>;

export const DefaultLevelsRow: Story = {
  args: {
    taxonomy: CANONICAL_TAXONOMIES[0], // Levels
    capabilities: getCapabilities('publisher'),
    onSelect: (tax) => console.log('Selected:', tax.name),
    onEdit: (tax) => console.log('Edit:', tax.name),
    onDelete: (tax) => console.log('Delete:', tax.name),
  },
};

export const ExamBoardsRow: Story = {
  args: {
    taxonomy: CANONICAL_TAXONOMIES[2], // Exam Boards
    capabilities: getCapabilities('publisher'),
    onSelect: (tax) => console.log('Selected:', tax.name),
  },
};

export const EmptyTaxonomyRow: Story = {
  args: {
    taxonomy: CANONICAL_TAXONOMIES[5], // Skills (0 items)
    capabilities: getCapabilities('publisher'),
    onSelect: (tax) => console.log('Selected:', tax.name),
  },
};

export const ViewOnlyRow: Story = {
  args: {
    taxonomy: CANONICAL_TAXONOMIES[0],
    capabilities: getCapabilities('view_only'),
    onSelect: (tax) => console.log('Selected:', tax.name),
  },
};
