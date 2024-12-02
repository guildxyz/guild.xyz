import { RewardCard, RewardCardButton } from "@/components/rewards/RewardCard";
import { TooltipProvider } from "@/components/ui/Tooltip";
import type { Meta, StoryObj } from "@storybook/react";

const RewardCardExample = () => (
  <RewardCard
    title="Sample reward"
    description="Description"
    className="border-cyan-500"
  >
    <RewardCardButton className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 dark:active:bg-cyan-300 dark:hover:bg-cyan-400">
      Reward card button
    </RewardCardButton>
  </RewardCard>
);

const meta: Meta<typeof RewardCardExample> = {
  title: "Rewards/RewardCard",
  component: RewardCardExample,
  decorators: (Story) => (
    <TooltipProvider>
      <Story />
    </TooltipProvider>
  ),
};

export default meta;

type Story = StoryObj<typeof RewardCardExample>;

export const Default: Story = {};
