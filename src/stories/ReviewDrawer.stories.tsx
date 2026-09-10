import type { Meta, StoryObj } from '@storybook/react';
import { ReviewDrawer } from '../components/workflow/ReviewDrawer';
import { CANONICAL_CHANGES } from '../data/fixtures';
import { getCapabilities } from '../model/permissions';

const pending = CANONICAL_CHANGES.filter((c) => c.status === 'pending');
const accepted = CANONICAL_CHANGES.filter((c) => c.status === 'accepted');

const meta: Meta<typeof ReviewDrawer> = {
  title: 'Workflow / ReviewDrawer',
  component: ReviewDrawer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ReviewDrawer>;

export const PublisherReviewMode: Story = {
  args: {
    isOpen: true,
    pendingChanges: pending,
    acceptedChanges: accepted,
    capabilities: getCapabilities('publisher'),
    onAcceptChange: (id) => console.log('Accept:', id),
    onRejectChange: (id) => console.log('Reject:', id),
    onClose: () => console.log('Close'),
    onOpenPublish: () => console.log('Open publish dialog'),
  },
};

export const EditorViewOnlyChanges: Story = {
  args: {
    isOpen: true,
    pendingChanges: pending,
    acceptedChanges: accepted,
    capabilities: getCapabilities('editor'),
    onAcceptChange: () => {},
    onRejectChange: () => {},
    onClose: () => console.log('Close'),
  },
};

export const EmptyQueue: Story = {
  args: {
    isOpen: true,
    pendingChanges: [],
    acceptedChanges: [],
    capabilities: getCapabilities('publisher'),
    onAcceptChange: () => {},
    onRejectChange: () => {},
    onClose: () => console.log('Close'),
  },
};
