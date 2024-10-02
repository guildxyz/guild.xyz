import { Meta } from "@storybook/react"
import { ProgressIndicator, ProgressRoot } from "./Progress"

export const Progress = ({ value }: { value: number }) => {
  return (
    <ProgressRoot>
      <ProgressIndicator value={value} />
    </ProgressRoot>
  )
}

const meta: Meta<typeof Progress> = {
  title: "Design system/Progress",
  component: Progress,
  args: {
    value: 0.44,
  },
}

export default meta
