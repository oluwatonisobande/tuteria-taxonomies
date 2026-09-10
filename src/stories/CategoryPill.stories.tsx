import type { Meta, StoryObj } from '@storybook/react';
import { CategoryPill, CategoryList } from '../components/primitives/CategoryPill';

const meta: Meta<typeof CategoryPill> = {
  title: 'Design System / Primitives / CategoryPill',
  component: CategoryPill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CategoryPill>;

export const SingleCategory: Story = {
  args: {
    label: 'Primary Education',
  },
};

export const CategoryListFew: StoryObj<typeof CategoryList> = {
  render: () => (
    <CategoryList categories={['Primary Education', 'Secondary']} maxDisplay={2} />
  ),
};

export const CategoryListOverflow: StoryObj<typeof CategoryList> = {
  render: () => (
    <CategoryList
      categories={['Primary', 'Secondary', 'Tertiary', 'Vocational']}
      maxDisplay={2}
    />
  ),
};

export const CategoryListEmpty: StoryObj<typeof CategoryList> = {
  render: () => <CategoryList categories={[]} />,
};
