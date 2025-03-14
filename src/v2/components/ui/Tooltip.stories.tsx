import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"
import {
  Tooltip,
  TooltipContent,
  TooltipContentProps,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip"

const TooltipExample = (tooltipContentProps: TooltipContentProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm">
          Hover me!
        </Button>
      </TooltipTrigger>
      <TooltipContent {...tooltipContentProps}>
        <p>This is a tooltip!</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const meta: Meta<typeof TooltipExample> = {
  title: "Design system/Tooltip",
  component: TooltipExample,
}

export default meta

type Story = StoryObj<typeof TooltipExample>

export const Default: Story = {}
export const Popover: Story = {
  args: {
    variant: "popover",
  },
}
