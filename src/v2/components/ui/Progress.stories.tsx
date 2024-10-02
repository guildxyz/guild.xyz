import { Meta } from "@storybook/react"
import { ProgressIndicator, ProgressRoot } from "./Progress"

export const Progress = () => {
  return (
    <ProgressRoot>
      <ProgressIndicator value={0.44} />
    </ProgressRoot>
  )
}

const meta: Meta<typeof Progress> = {
  title: "Design system/Progress",
  component: Progress,
}

export default meta
