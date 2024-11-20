import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "app/components/ui/Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Design system/Textarea",
  component: Textarea,
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "This is a textarea...",
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
