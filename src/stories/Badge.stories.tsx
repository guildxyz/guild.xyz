import { Badge, type BadgeProps } from "@/components/ui/Badge";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Badge> = {
  title: "Design system/Badge",
  component: Badge,
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Default",
    size: "md",
  },
  argTypes: {
    size: {
      type: "string",
      control: "select",
      options: ["sm", "md", "lg"] satisfies BadgeProps["size"][],
    },
  },
};
