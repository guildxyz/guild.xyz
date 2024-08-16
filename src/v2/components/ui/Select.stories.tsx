import {
  SelectContent,
  SelectItem,
  Select as SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Meta } from "@storybook/react"

export const Select = () => {
  return (
    <SelectRoot>
      <SelectTrigger>
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </SelectRoot>
  )
}

const meta: Meta<typeof Select> = {
  title: "Design system/Select",
  component: Select,
}

export default meta
