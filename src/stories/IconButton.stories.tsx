import { IconButton, type IconButtonProps } from "@/components/ui/IconButton";
import { CircleDashed } from "@phosphor-icons/react/dist/ssr";
import type { Meta, StoryObj } from "@storybook/react";

type IconButtonExampleProps = Omit<IconButtonProps, "aria-label" | "icon">;

const IconButtonExample = (props: IconButtonExampleProps) => (
  <IconButton
    {...props}
    aria-label="IconButton example"
    icon={<CircleDashed weight="bold" />}
  />
);

const meta: Meta<typeof IconButtonExample> = {
  title: "Design system/IconButton",
  component: IconButtonExample,
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Solid: Story = {
  args: {
    size: "md",
    variant: "solid",
    colorScheme: "primary",
    isLoading: false,
    disabled: false,
  },
  argTypes: {
    size: {
      type: "string",
      control: "select",
      options: ["sm", "md", "lg"] satisfies IconButtonProps["size"][],
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
      ] satisfies IconButtonProps["colorScheme"][],
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
  },
};

export const Outline: Story = {
  args: {
    ...Solid.args,
    variant: "outline",
  },
  argTypes: {
    ...Solid.argTypes,
  },
};

export const Ghost: Story = {
  args: {
    ...Solid.args,
    variant: "ghost",
  },
  argTypes: {
    ...Solid.argTypes,
  },
};

export const Subtle: Story = {
  args: {
    ...Solid.args,
    variant: "subtle",
  },
  argTypes: {
    ...Solid.argTypes,
  },
};
