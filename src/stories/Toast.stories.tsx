import { Button } from "@/components/ui/Button";
import { Toaster } from "@/components/ui/Toaster";
import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";

type ToastExampleProps = {
  title: string;
  description?: string;
  action?: boolean;
  closeButton?: boolean;
};
const ToastExample = ({
  title = "Toast example",
  description,
  action,
  closeButton,
}: ToastExampleProps) => {
  return (
    <>
      <Button
        onClick={() =>
          toast(title, {
            description,
            action: action ? (
              <Button size="xs" className="ml-auto">
                Action
              </Button>
            ) : undefined,
            closeButton,
          })
        }
      >
        Show toast!
      </Button>
      <Toaster />
    </>
  );
};

const meta: Meta<typeof ToastExample> = {
  title: "Design system/Toast",
  component: ToastExample,
};

export default meta;

type Story = StoryObj<typeof ToastExample>;

export const Default: Story = {
  args: {
    title: "Toast example",
    description: "",
    action: false,
    closeButton: false,
  },
};
