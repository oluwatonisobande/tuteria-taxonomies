import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/primitives/Button';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Design System / Primitives / Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Publish Changes',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'View History',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Reset Filter',
    variant: 'outline',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete Taxonomy',
    variant: 'danger',
    icon: <Trash2 className="w-4 h-4" />,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'New Taxonomy',
    variant: 'primary',
    icon: <Plus className="w-4 h-4" />,
  },
};

export const Loading: Story = {
  args: {
    children: 'Publishing...',
    variant: 'primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Publish (0)',
    variant: 'primary',
    disabled: true,
  },
};
