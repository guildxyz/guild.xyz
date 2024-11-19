import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "app/components/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "app/components/ui/Drawer";

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
