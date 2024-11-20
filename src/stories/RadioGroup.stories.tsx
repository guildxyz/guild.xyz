import { Label } from "@/components/ui/Label";
import {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
} from "@/components/ui/RadioGroup";
import type { Meta, StoryObj } from "@storybook/react";

const RadioGroupExample = (props: RadioGroupProps) => (
  <RadioGroup {...props} defaultValue="option-one">
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option-one" id="option-one" />
      <Label htmlFor="option-one">Option One</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option-two" id="option-two" />
      <Label htmlFor="option-two">Option Two</Label>
    </div>
  </RadioGroup>
);

const meta: Meta<typeof RadioGroupExample> = {
  title: "Design system/RadioGroup",
  component: RadioGroupExample,
};

export default meta;

type Story = StoryObj<typeof RadioGroupExample>;

export const Default: Story = {
  args: {
    disabled: false,
  },
  argTypes: {
    disabled: {
      type: "boolean",
      control: "boolean",
    },
  },
};
