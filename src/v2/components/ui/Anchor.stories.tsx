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
    href: "#",
    variant: "default",
    showExternal: false,
  },
  argTypes: {
    variant: {
      control: {
        disable: true,
      },
    },
    showExternal: {
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

export const Muted: Story = {
  args: {
    ...Default.args,
    variant: "muted",
    children: "Muted",
  },
  argTypes: {
    ...Default.argTypes,
  },
}

export const Highlighted: Story = {
  args: {
    ...Default.args,
    variant: "highlighted",
    children: "Highlighted",
  },
  argTypes: {
    ...Default.argTypes,
  },
}

export const Unstyled: Story = {
  args: {
    ...Default.args,
    variant: "unstyled",
    children: "Unstyled",
  },
  argTypes: {
    ...Default.argTypes,
  },
}
