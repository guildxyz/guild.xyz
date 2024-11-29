import { RequirementLink } from "@/components/requirements/RequirementLink";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RequirementLink> = {
  title: "Requirement building blocks/RequirementLink",
  component: RequirementLink,
};

export default meta;

type Story = StoryObj<typeof RequirementLink>;

export const Default: Story = {
  args: {
    href: "https://polygonscan.com/token/0xff04820c36759c9f5203021fe051239ad2dcca8a",
    children: "Guild Pin contract",
  },
};
