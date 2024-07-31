import type { Meta, StoryObj } from "@storybook/react"
import { ComponentProps, FunctionComponent } from "react"
import { Toggle } from "./Toggle"
import { ToggleGroup } from "./ToggleGroup"

const items = ["Alpha", "Beta", "Gamma", "Delta"] as const

const ToggleGroupStory: FunctionComponent<ComponentProps<typeof ToggleGroup>> = (
  props
) => {
  return (
    <ToggleGroup {...props}>
      {items.map((item, _) => (
        <Toggle value={item} key={item}>
          {item}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

const meta: Meta<typeof ToggleGroupStory> = {
  title: "Design system/ToggleGroup",
  component: ToggleGroupStory,
}

export default meta

type Story = StoryObj<typeof ToggleGroupStory>
type ToggleGroupProps = Parameters<typeof ToggleGroupStory>[0]

export const Default: Story = {
  args: {
    type: "single",
    variant: "primary",
    size: "md",
  },
  argTypes: {
    type: {
      type: "string",
      control: "select",
      options: ["multiple", "single"] satisfies ToggleGroupProps["type"][],
    },
    variant: {
      type: "string",
      control: "select",
      options: [
        "secondary",
        "primary",
        "primary-ghost",
        "mono",
        "outline",
      ] satisfies ToggleGroupProps["variant"][],
    },
    size: {
      type: "string",
      control: "select",
      options: ["sm", "md", "lg", "icon"] satisfies ToggleGroupProps["size"][],
    },
  },
}
