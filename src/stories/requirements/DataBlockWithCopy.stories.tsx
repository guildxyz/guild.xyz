import { DataBlockWithCopy } from "@/components/requirements/DataBlockWithCopy";
import { Card } from "@/components/ui/Card";
import { TooltipProvider } from "@/components/ui/Tooltip";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DataBlockWithCopy> = {
  title: "Requirement building blocks/DataBlockWithCopy",
  component: DataBlockWithCopy,
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

type Story = StoryObj<typeof DataBlockWithCopy>;

export const Default: Story = {
  args: {
    children: "DataBlockWithCopy",
    text: "DataBlockWithCopy",
  },
};
