import type { Meta, StoryObj } from '@storybook/react';
import { VersionHistoryDrawer } from '../components/workflow/VersionHistoryDrawer';
import { CANONICAL_VERSION_HISTORY } from '../data/fixtures';

const meta: Meta<typeof VersionHistoryDrawer> = {
  title: 'Workflow / VersionHistoryDrawer',
  component: VersionHistoryDrawer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof VersionHistoryDrawer>;

export const DefaultHistory: Story = {
  args: {
    isOpen: true,
    history: CANONICAL_VERSION_HISTORY,
    onClose: () => console.log('Close'),
  },
};

export const SingleRelease: Story = {
  args: {
    isOpen: true,
    history: [CANONICAL_VERSION_HISTORY[0]],
    onClose: () => console.log('Close'),
  },
};
