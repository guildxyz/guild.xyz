import { Button } from "@/components/ui/Button";
import { Toaster } from "@/components/ui/Toaster";
import { BookOpen } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";

type ToastExampleProps = {
  title: string;
  description?: string;
  action?: boolean;
  closeButton?: boolean;
  withIcon?: boolean;
  durationMs?: number;
};
const ToastExample = ({
  title = "Toast example",
  description,
  action,
  closeButton,
  withIcon,
  durationMs: duration,
}: ToastExampleProps) => {
  return (
    <>
      <Button
        onClick={() =>
          toast(title, {
            duration,
            icon: withIcon && <BookOpen weight="fill" />,
            description,
            action: action ? (
              <Button size="xs" className="ml-auto min-w-max">
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
    withIcon: false,
    durationMs: 4000,
  },
};
