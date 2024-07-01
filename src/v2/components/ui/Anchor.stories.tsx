import type { Meta, StoryObj } from "@storybook/react"

import { Anchor } from "./Anchor"

const meta: Meta<typeof Anchor> = {
  title: "Design system/Anchor",
  component: Anchor,
}

export default meta

type Story = StoryObj<typeof Anchor>

export const Default: Story = {
  args: {
    children: "Default",
    variant: "default",
  },
  argTypes: {
    variant: {
      control: {
        disable: true,
      },
    },
    asChild: {
      control: {
        disable: true,
      },
    },
  },
}

export const Muted: Story = {
  args: {
    ...Default.args,
    variant: "muted",
    children: "Muted"
  },
  argTypes: {
    ...Default.argTypes,
  },
}

export const Silent: Story = {
  args: {
    ...Default.args,
    variant: "silent",
    children: "Silent"
  },
  argTypes: {
    ...Default.argTypes,
  },
}

