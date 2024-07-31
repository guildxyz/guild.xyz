import type { Meta, StoryFn } from "@storybook/react"
import { Toggle } from "./Toggle"
import { ToggleGroup } from "./ToggleGroup"

const meta: Meta = {
  title: "Design system/ToggleGroup",
}

const items = ["Alpha", "Beta", "Gamma", "Delta"] as const

export default meta

export const Static: StoryFn = () => {
  return (
    <ToggleGroup type="single">
      {items.map((item, _) => (
        <Toggle value={item} key={item}>
          {item}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
