import type { Meta, StoryObj } from "@storybook/react"

import { Check, Info as InfoIcon, Warning as WarningIcon, X } from "phosphor-react"
import { Alert, AlertDescription, AlertProps, AlertTitle } from "./Alert"
import { Card } from "./Card"

const icons = {
  info: InfoIcon,
  success: Check,
  warning: WarningIcon,
  error: X,
} as const

const AlertExample = (props: AlertProps) => {
  const AlertIcon = icons[props.variant]
  return (
    <Alert {...props}>
      <AlertIcon weight="fill" className="size-6" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
  )
}

const meta: Meta<typeof Alert> = {
  title: "Design system/Alert",
  component: AlertExample,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Card className="p-4">
          <h2 className="font-black font-display text-xl">Alert example</h2>
          <p className="mb-4">
            On a Card component, so we can see the colors properly
          </p>
          <Story />
        </Card>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof AlertExample>

export const Info: Story = {
  args: {
    variant: "info",
  },
}
export const Success: Story = {
  args: {
    variant: "success",
  },
}
export const Warning: Story = {
  args: {
    variant: "warning",
  },
}
export const Error: Story = {
  args: {
    variant: "error",
  },
}
