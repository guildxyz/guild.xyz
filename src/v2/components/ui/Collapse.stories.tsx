import { useDisclosure } from "@/hooks/useDisclosure"
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"
import { Collapse, CollapseProps } from "./Collapse"

const CollapseExample = ({
  animateOpacity,
}: Pick<CollapseProps, "animateOpacity">) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <div className="flex flex-col gap-4">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onToggle()}
        className="w-max"
      >
        Toggle collapse
      </Button>

      <Collapse open={isOpen} animateOpacity={animateOpacity}>
        <div>Collapse content</div>
      </Collapse>
    </div>
  )
}

const meta: Meta<typeof CollapseExample> = {
  title: "Design system/Collapse",
  component: CollapseExample,
}

export default meta

type Story = StoryObj<typeof CollapseExample>

export const Default: Story = {
  args: {
    animateOpacity: false,
  },
}
