import { DataBlock } from "@/components/requirements/DataBlock";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DataBlock> = {
  title: "Requirement building blocks/DataBlock",
  component: DataBlock,
};

export default meta;

type Story = StoryObj<typeof DataBlock>;

export const Default: Story = {
  args: {
    children: "DataBlock",
  },
};
