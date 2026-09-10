import type { Meta, StoryObj } from '@storybook/react';
import { TypePill } from '../components/primitives/TypePill';

const meta: Meta<typeof TypePill> = {
  title: 'Design System / Primitives / TypePill',
  component: TypePill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TypePill>;

export const Levels: Story = {
  args: {
    type: 'Levels',
  },
};

export const Terms: Story = {
  args: {
    type: 'Terms',
  },
};

export const LearningSystems: Story = {
  args: {
    type: 'Learning Systems',
  },
};

export const LearningGoals: Story = {
  args: {
    type: 'Learning Goals',
  },
};

export const ExamBoards: Story = {
  args: {
    type: 'Exam Boards',
  },
};

export const Skills: Story = {
  args: {
    type: 'Skills',
  },
};

export const AllTypesCollection: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200">
      <TypePill type="Levels" />
      <TypePill type="Terms" />
      <TypePill type="Learning Systems" />
      <TypePill type="Learning Goals" />
      <TypePill type="Exam Boards" />
      <TypePill type="Skills" />
    </div>
  ),
};
