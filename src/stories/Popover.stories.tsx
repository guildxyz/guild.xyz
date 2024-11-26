import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import type { Meta, StoryObj } from "@storybook/react";

const PopoverExample = () => (
  <Popover>
    <PopoverTrigger>Open popover</PopoverTrigger>
    <PopoverContent>Popover content</PopoverContent>
  </Popover>
);

const meta: Meta<typeof PopoverExample> = {
  title: "Design system/Popover",
  component: PopoverExample,
};

export default meta;

type Story = StoryObj<typeof PopoverExample>;

export const Default: Story = {};
