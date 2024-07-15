import type { Meta, StoryObj } from "@storybook/react"

import { Button, ButtonProps } from "./Button"

const meta: Meta<typeof Button> = {
  title: "Design system/Button",
  component: Button,
}

export default meta

type Story = StoryObj<typeof Button>

export const Solid: Story = {
  args: {
    children: "Solid",
    size: "md",
    variant: "solid",
    colorScheme: "primary",
    isLoading: false,
    disabled: false,
  },
  argTypes: {
    size: {
      type: "string",
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"] satisfies ButtonProps["size"][],
    },
    colorScheme: {
      type: "string",
      control: "select",
      options: [
        "primary",
        "secondary",
        "info",
        "destructive",
        "success",
      ] satisfies ButtonProps["colorScheme"][],
    },
    variant: {
      control: {
        disable: true,
      },
    },
    disabled: {
      type: "boolean",
      control: "boolean",
    },
    asChild: {
      control: {
        disable: true,
      },
    },
  },
}

export const Outline: Story = {
  args: {
    ...Solid.args,
    variant: "outline",
    children: "Outline",
  },
  argTypes: {
    ...Solid.argTypes,
  },
}

export const Ghost: Story = {
  args: {
    ...Solid.args,
    variant: "ghost",
    children: "Ghost",
  },
  argTypes: {
    ...Solid.argTypes,
  },
}

export const Subtle: Story = {
  args: {
    ...Solid.args,
    variant: "subtle",
    children: "Subtle",
  },
  argTypes: {
    ...Solid.argTypes,
  },
}
