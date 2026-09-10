import type { Meta, StoryObj } from '@storybook/react';
import { TaxonomyDrawer } from '../components/drawer/TaxonomyDrawer';
import { CANONICAL_TAXONOMIES } from '../data/fixtures';
import { getCapabilities } from '../model/permissions';

const meta: Meta<typeof TaxonomyDrawer> = {
  title: 'Components / Drawer / TaxonomyDrawer',
  component: TaxonomyDrawer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof TaxonomyDrawer>;

export const ViewMode: Story = {
  args: {
    isOpen: true,
    taxonomy: CANONICAL_TAXONOMIES[0],
    capabilities: getCapabilities('publisher'),
    initialMode: 'view',
    onClose: () => console.log('Close'),
    onSave: (data) => console.log('Save:', data),
  },
};

export const EditModePublisher: Story = {
  args: {
    isOpen: true,
    taxonomy: CANONICAL_TAXONOMIES[0],
    capabilities: getCapabilities('publisher'),
    initialMode: 'edit',
    onClose: () => console.log('Close'),
    onSave: (data) => console.log('Save:', data),
  },
};

export const EditModeEditor: Story = {
  args: {
    isOpen: true,
    taxonomy: CANONICAL_TAXONOMIES[0],
    capabilities: getCapabilities('editor'),
    initialMode: 'edit',
    onClose: () => console.log('Close'),
    onSave: (data) => console.log('Propose:', data),
  },
};

export const CreateNewTaxonomy: Story = {
  args: {
    isOpen: true,
    taxonomy: null,
    capabilities: getCapabilities('publisher'),
    initialMode: 'edit',
    onClose: () => console.log('Close'),
    onSave: (data) => console.log('Create:', data),
  },
};

export const ViewOnlyMode: Story = {
  args: {
    isOpen: true,
    taxonomy: CANONICAL_TAXONOMIES[2],
    capabilities: getCapabilities('view_only'),
    initialMode: 'view',
    onClose: () => console.log('Close'),
    onSave: () => {},
  },
};
