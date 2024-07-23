import type { Meta, StoryObj } from "@storybook/react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./Collapsible"

const CollapsibleExample = () => (
  <Collapsible>
    <CollapsibleTrigger>Toggle collapse</CollapsibleTrigger>
    <CollapsibleContent>Collapse content</CollapsibleContent>
  </Collapsible>
)

const meta: Meta<typeof CollapsibleExample> = {
  title: "Design system/Collapsible",
  component: CollapsibleExample,
}

export default meta

type Story = StoryObj<typeof CollapsibleExample>

export const Default: Story = {}
