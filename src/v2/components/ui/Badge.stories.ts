import type { Meta, StoryObj } from "@storybook/react"
import { Badge, BadgeProps } from "./Badge"

const meta: Meta<typeof Badge> = {
  title: "Design system/Badge",
  component: Badge,
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: "Default",
    variant: "default",
    colorScheme: "gray",
    size: "md",
  },
  argTypes: {
    variant: {
      control: {
        disable: true,
      },
    },
    colorScheme: {
      type: "string",
      control: "select",
      options: ["gray", "blue"] satisfies BadgeProps["colorScheme"][],
    },
    size: {
      type: "string",
      control: "select",
      options: ["sm", "md", "lg"] satisfies BadgeProps["size"][],
    },
  },
}
