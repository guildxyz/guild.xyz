import { ChainIndicator } from "@/components/requirements/ChainIndicator";
import { DataBlockWithCopy } from "@/components/requirements/DataBlockWithCopy";
import {
  Requirement,
  RequirementContent,
  RequirementFooter,
  RequirementImage,
} from "@/components/requirements/Requirement";
import { RequirementLink } from "@/components/requirements/RequirementLink";
import { Card } from "@/components/ui/Card";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { QuestionMark } from "@phosphor-icons/react/dist/ssr";
import type { Meta, StoryObj } from "@storybook/react";

const RequirementExample = () => (
  <Card className="max-w-sm px-6 py-4">
    <Requirement>
      <RequirementImage>
        <QuestionMark weight="bold" className="size-6" />
      </RequirementImage>
      <RequirementContent>
        <p>
          <span>{"Copy "}</span>
          <DataBlockWithCopy text="this text" />
          <span>{" to your clipboard"}</span>
        </p>

        <RequirementFooter className="text-secondary text-sm">
          <ChainIndicator chain={1} />
          <RequirementLink href="https://polygonscan.com/token/0xff04820c36759c9f5203021fe051239ad2dcca8a">
            View on explorer
          </RequirementLink>
        </RequirementFooter>
      </RequirementContent>
    </Requirement>
  </Card>
);

const meta: Meta<typeof RequirementExample> = {
  title: "Requirement building blocks/Requirement",
  component: RequirementExample,
  decorators: (Story) => (
    <TooltipProvider>
      <Story />
    </TooltipProvider>
  ),
};

export default meta;

type Story = StoryObj<typeof RequirementExample>;

export const Default: Story = {};
