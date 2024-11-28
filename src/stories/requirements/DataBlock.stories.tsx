import { DataBlock } from "@/components/requirements/DataBlock";
import { Card } from "@/components/ui/Card";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DataBlock> = {
  title: "Requirement building blocks/DataBlock",
  component: DataBlock,
  decorators: (Story) => (
    <Card className="p-4">
      <span>{"This is a "}</span>
      <Story />
      <span>{" example"}</span>
    </Card>
  ),
};

export default meta;

type Story = StoryObj<typeof DataBlock>;

export const Default: Story = {
  args: {
    children: "DataBlock",
  },
};
