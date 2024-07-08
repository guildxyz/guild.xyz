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
    size: "md",
  },
  argTypes: {
    variant: {
      control: {
        disable: true,
      },
    },
    size: {
      type: "string",
      control: "radio",
      options: ["sm", "md", "lg"] satisfies BadgeProps["size"][],
    },
  },
}

export const Secondary: Story = {
  args: {
    ...Default.args,
    children: "Secondary",
    variant: "secondary",
  },
  argTypes: Default.argTypes,
}

export const Destructive: Story = {
  args: {
    ...Default.args,
    children: "Destructive",
    variant: "destructive",
  },
  argTypes: Default.argTypes,
}

export const Outline: Story = {
  args: {
    ...Default.args,
    children: "Outline",
    variant: "outline",
  },
  argTypes: Default.argTypes,
}
