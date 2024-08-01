import type { Meta, StoryObj } from "@storybook/react"
import { Toggle } from "./Toggle"

const meta: Meta<typeof Toggle> = {
  title: "Design system/Toggle",
  component: Toggle,
}

export default meta

type Story = StoryObj<typeof Toggle>

const Default: Story = {
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

export const Secondary: Story = {
  ...Default,
  args: {
    ...Default.args,
    children: "Secondary",
    variant: "secondary",
  },
}

export const Primary: Story = {
  ...Default,
  args: {
    variant: "primary",
    children: "Primary",
  },
}

export const Mono: Story = {
  ...Default,
  args: {
    variant: "mono",
    children: "Mono",
  },
}
