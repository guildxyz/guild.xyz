import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  type TooltipContentProps,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import type { Meta, StoryObj } from "@storybook/react";

const TooltipExample = (tooltipContentProps: TooltipContentProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm">
          Hover me!
        </Button>
      </TooltipTrigger>
      <TooltipContent {...tooltipContentProps}>
        <p>This is a tooltip!</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const meta: Meta<typeof TooltipExample> = {
  title: "Design system/Tooltip",
  component: TooltipExample,
};

export default meta;

type Story = StoryObj<typeof TooltipExample>;

export const Default: Story = {};
export const Popover: Story = {
  args: {
    variant: "popover",
  },
};
