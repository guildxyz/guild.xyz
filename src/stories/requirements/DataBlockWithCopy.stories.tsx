import { DataBlockWithCopy } from "@/components/requirements/DataBlockWithCopy";
import { TooltipProvider } from "@/components/ui/Tooltip";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DataBlockWithCopy> = {
  title: "Requirement building blocks/DataBlockWithCopy",
  component: DataBlockWithCopy,
  decorators: (Story) => (
    <TooltipProvider>
      <Story />
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
