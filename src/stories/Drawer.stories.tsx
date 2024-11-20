import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import type { Meta, StoryObj } from "@storybook/react";

const DrawerExample = () => (
  <Drawer>
    <DrawerTrigger>Open</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      </DrawerHeader>
      <DrawerFooter>
        <Button colorScheme="primary">Submit</Button>
        <DrawerClose asChild>
          <Button variant="subtle">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);

const meta: Meta<typeof DrawerExample> = {
  title: "Design system/Drawer",
  component: DrawerExample,
};

export default meta;

type Story = StoryObj<typeof DrawerExample>;

export const Default: Story = {};
