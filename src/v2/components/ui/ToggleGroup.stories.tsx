import type { Meta, StoryObj } from "@storybook/react"
import { ComponentProps, FunctionComponent } from "react"
import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup"

const items = ["Alpha", "Beta", "Gamma", "Delta"] as const

const ToggleGroupExample: FunctionComponent<ComponentProps<typeof ToggleGroup>> = (
  props
) => {
  return (
    <ToggleGroup {...props}>
      {items.map((item, _) => (
        <ToggleGroupItem value={item} key={item}>
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

const meta: Meta<typeof ToggleGroupExample> = {
  title: "Design system/ToggleGroup",
  component: ToggleGroupExample,
}

export default meta

type Story = StoryObj<typeof ToggleGroupExample>
type ToggleGroupProps = Parameters<typeof ToggleGroupExample>[0]

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
        "mono",
      ] satisfies ToggleGroupProps["variant"][],
    },
    size: {
      type: "string",
      control: "select",
      options: ["sm", "md", "lg", "icon"] satisfies ToggleGroupProps["size"][],
    },
  },
}
