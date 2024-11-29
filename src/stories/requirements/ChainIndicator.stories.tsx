import { ChainIndicator } from "@/components/requirements/ChainIndicator";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ChainIndicator> = {
  title: "Requirement building blocks/ChainIndicator",
  component: ChainIndicator,
};

export default meta;

type Story = StoryObj<typeof ChainIndicator>;

export const Default: Story = {
  args: {
    chain: 1,
  },
};
