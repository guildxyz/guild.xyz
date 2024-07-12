import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion"
import {
  AccordionMultipleProps,
  AccordionSingleProps,
} from "@radix-ui/react-accordion"
import type { Meta, StoryObj } from "@storybook/react"
import { ArrowSquareOut } from "phosphor-react"

const AccordionExample = (props: AccordionSingleProps | AccordionMultipleProps) => (
  <Accordion
    type={props.type}
    collapsible={props.type === "single" ? props.collapsible : undefined}
  >
    <AccordionItem value="item-1">
      <AccordionTrigger>What's this?</AccordionTrigger>
      <AccordionContent>
        <a
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          An accordion.
          <ArrowSquareOut className="ml-0.5 inline" weight="bold" />
        </a>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="item-2">
      <AccordionTrigger>And what's this?</AccordionTrigger>
      <AccordionContent>
        This is the second item inside the accordion.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const meta: Meta<typeof AccordionExample> = {
  title: "Design system/Accordion",
  component: AccordionExample,
}

export default meta

type Story = StoryObj<typeof AccordionExample>

export const Default: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  argTypes: {
    type: {
      control: {
        type: "select",
      },
      options: ["single", "multiple"],
    },
  },
}
