import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer"

const DrawerExample = () => (
  <Drawer>
    <DrawerTrigger>Open</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        <DrawerDescription>This action cannot be undone.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button className="mx-auto w-fit">Submit</Button>
        <DrawerClose>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
)

const meta: Meta<typeof DrawerExample> = {
  title: "Design system/Drawer",
  component: DrawerExample,
}

export default meta

type Story = StoryObj<typeof DrawerExample>

export const Default: Story = {}
