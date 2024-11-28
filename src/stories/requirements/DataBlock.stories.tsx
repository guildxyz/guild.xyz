import { DataBlock } from "@/components/requirements/DataBlock";
import { Card } from "@/components/ui/Card";
import { TooltipProvider } from "@/components/ui/Tooltip";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DataBlock> = {
  title: "Requirement building blocks/DataBlock",
  component: DataBlock,
  decorators: (Story) => (
    <TooltipProvider>
      <Card className="p-4">
        <span>{"This is a "}</span>
        <Story />
        <span>{" example"}</span>
      </Card>
    </TooltipProvider>
  ),
};

export default meta;

type Story = StoryObj<typeof DataBlock>;

export const Default: Story = {
  args: {
    children: "DataBlock",
    error: "",
  },
};

export const ErrorState: Story = {
  name: "Error state",
  args: {
    ...Default.args,
    error: "An error occurred",
  },
};
