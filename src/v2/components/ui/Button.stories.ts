import type { Meta, StoryObj } from "@storybook/react"

import { Button, ButtonProps } from "./Button"

const meta: Meta<typeof Button> = {
  title: "Button",
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
