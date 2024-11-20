import { Button, type ButtonProps } from "@/components/ui/Button";
import { CircleDashed } from "@phosphor-icons/react/dist/ssr";
import type { Meta, StoryObj } from "@storybook/react";

type ButtonExampleProps = Omit<ButtonProps, "leftIcon" | "rightIcon"> & {
  leftIcon?: boolean;
  rightIcon?: boolean;
};
const ButtonExample = (props: ButtonExampleProps) => (
  <Button
    {...props}
    leftIcon={props.leftIcon ? <CircleDashed weight="bold" /> : undefined}
    rightIcon={props.rightIcon ? <CircleDashed weight="bold" /> : undefined}
  />
);

const meta: Meta<typeof ButtonExample> = {
  title: "Design system/Button",
  component: ButtonExample,
};

export default meta;

type Story = StoryObj<typeof ButtonExample>;

export const Solid: Story = {
  args: {
    children: "Solid",
    size: "md",
    variant: "solid",
    colorScheme: "primary",
    isLoading: false,
    disabled: false,
    leftIcon: false,
    rightIcon: false,
    loadingText: "",
  },
  argTypes: {
    size: {
      type: "string",
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"] satisfies ButtonProps["size"][],
    },
    colorScheme: {
      type: "string",
      control: "select",
      options: [
        "primary",
        "secondary",
        "info",
        "destructive",
        "success",
      ] satisfies ButtonProps["colorScheme"][],
    },
    variant: {
      control: {
        disable: true,
      },
    },
    disabled: {
      type: "boolean",
      control: "boolean",
    },
    leftIcon: {
      type: "boolean",
      control: "boolean",
    },
    rightIcon: {
      type: "boolean",
      control: "boolean",
    },
    asChild: {
      control: {
        disable: true,
      },
    },
  },
};

export const Outline: Story = {
  args: {
    ...Solid.args,
    variant: "outline",
    children: "Outline",
  },
  argTypes: {
    ...Solid.argTypes,
  },
};

export const Ghost: Story = {
  args: {
    ...Solid.args,
    variant: "ghost",
    children: "Ghost",
  },
  argTypes: {
    ...Solid.argTypes,
  },
};

export const Subtle: Story = {
  args: {
    ...Solid.args,
    variant: "subtle",
    children: "Subtle",
  },
  argTypes: {
    ...Solid.argTypes,
  },
};
