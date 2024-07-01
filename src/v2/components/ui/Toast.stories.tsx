import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "./Button"
import { useToast } from "./hooks/useToast"
import { ToastAction, ToastActionElement, ToastProps } from "./Toast"
import { Toaster } from "./Toaster"

const ToastExample = (props: {
  variant: ToastProps["variant"]
  action?: ToastActionElement
}) => {
  const { toast } = useToast()

  return (
    <Button
      onClick={() =>
        toast({
          title: "Example toast",
          description: "This is the toast's descriptions",
          ...props,
        })
      }
    >
      Show toast
    </Button>
  )
}

const meta: Meta = {
  title: "Design system/Toast",
  component: ToastExample,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
}

type Story = StoryObj<typeof ToastExample>

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

export const WithAction: Story = {
  name: "With action",
  args: {
    variant: "info",
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
}

export default meta
