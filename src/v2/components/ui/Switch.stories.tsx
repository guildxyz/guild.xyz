import { Meta, StoryObj } from "@storybook/react"
import { Label } from "./Label"
import { Switch, SwitchProps } from "./Switch"

const SwitchExample = (props: SwitchProps) => (
  <div className="flex items-center space-x-2">
    <Switch id="demo-switch" {...props} />
    <Label htmlFor="demo-switch">Demo switch</Label>
  </div>
)

const meta: Meta<typeof SwitchExample> = {
  title: "Design system/Switch",
  component: SwitchExample,
}

export default meta

type Story = StoryObj<typeof SwitchExample>

export const Default: Story = {
  args: {
    disabled: false,
  },
  argTypes: {
    disabled: {
      type: "boolean",
      control: "boolean",
    },
  },
}
