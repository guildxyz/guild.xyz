import type { Meta, StoryObj } from "@storybook/react";
import { Badge, type BadgeProps } from "app/components/ui/Badge";

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
