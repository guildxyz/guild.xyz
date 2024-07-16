import type { Meta, StoryObj } from "@storybook/react"

import { ThemeProvider } from "next-themes"
import { NavMenu } from "./NavMenu"

const meta: Meta<typeof NavMenu> = {
  title: "Guild UI/NavMenu",
  component: NavMenu,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof NavMenu>

export const Default: Story = {}
