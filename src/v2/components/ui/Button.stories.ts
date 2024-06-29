import type { Meta, StoryObj } from "@storybook/react"

import { Button, ButtonProps } from "./Button"

const meta: Meta<typeof Button> = {
  title: "Design system/Button",
  component: Button,
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: "Primary",
    size: "default",
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["xs", "sm", "default", "lg", "xl"] satisfies ButtonProps["size"][],
      type: "string",
    },
  },
}

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: "secondary",
    children: "Secondary",
  },
  argTypes: {
    ...Primary.argTypes,
  },
}

export const Outline: Story = {
  args: {
    ...Primary.args,
    variant: "outline",
    children: "Outline",
  },
  argTypes: {
    ...Primary.argTypes,
  },
}

export const Ghost: Story = {
  args: {
    ...Primary.args,
    variant: "ghost",
    children: "Ghost",
  },
  argTypes: {
    ...Primary.argTypes,
  },
}

export const Success: Story = {
  args: {
    ...Primary.args,
    variant: "success",
    children: "Success",
  },
  argTypes: {
    ...Primary.argTypes,
  },
}

export const Destructive: Story = {
  args: {
    ...Primary.args,
    variant: "destructive",
    children: "Destructive",
  },
  argTypes: {
    ...Primary.argTypes,
  },
}

export const Link: Story = {
  args: {
    ...Primary.args,
    variant: "link",
    children: "Link",
  },
  argTypes: {
    ...Primary.argTypes,
  },
}
