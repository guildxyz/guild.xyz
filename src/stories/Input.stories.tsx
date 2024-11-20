import type { Meta, StoryObj } from "@storybook/react";
import { Input, type InputProps } from "app/components/ui/Input";

const meta: Meta<typeof Input> = {
  title: "Design system/Input",
  component: Input,
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    size: "md",
    placeholder: "Default input",
  },
  argTypes: {
    size: {
      type: "string",
      control: "radio",
      options: ["md", "lg"] satisfies InputProps["size"][],
    },
  },
};

export const Invalid: Story = {
  args: {
    ...Default.args,
    "aria-invalid": true,
  },
  argTypes: {
    ...Default.argTypes,
  },
};
