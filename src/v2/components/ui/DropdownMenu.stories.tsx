import type { Meta, StoryObj } from "@storybook/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu"

const DropdownMenuExample = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>Open</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Menu title</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Menu item #1</DropdownMenuItem>
      <DropdownMenuItem>Another item</DropdownMenuItem>
      <DropdownMenuItem>This is the third one</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

const meta: Meta<typeof DropdownMenuExample> = {
  title: "Design system/DropdownMenu",
  component: DropdownMenuExample,
}

export default meta

type Story = StoryObj<typeof DropdownMenuExample>

export const Default: Story = {}
