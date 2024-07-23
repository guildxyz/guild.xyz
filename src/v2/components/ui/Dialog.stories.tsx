import type { Meta, StoryObj } from "@storybook/react"

import { ComponentProps } from "react"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogContentProps,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog"

const DialogExample = ({
  size,
  longContent,
  scrollBody,
  showHeader = true,
  showFooter,
}: {
  size?: DialogContentProps["size"]
  longContent?: ComponentProps<typeof DynamicDialogContent>["longContent"]
  scrollBody?: boolean
  showHeader?: boolean
  showFooter?: boolean
}) => (
  <Dialog defaultOpen>
    <DialogTrigger>Open dialog</DialogTrigger>
    <DialogContent size={size} scrollBody={scrollBody}>
      {showHeader && (
        <DialogHeader>
          <DialogTitle>Awesome dialog</DialogTitle>
          <DialogDescription>Less awesome, optional description</DialogDescription>
        </DialogHeader>
      )}

      <DialogBody scroll={scrollBody}>
        <DynamicDialogContent longContent={longContent} />
      </DialogBody>

      {showFooter && <DialogFooter>Sneaky dialog footer</DialogFooter>}

      <DialogCloseButton />
    </DialogContent>
  </Dialog>
)

const meta: Meta<typeof DialogExample> = {
  title: "Design system/Dialog",
  component: DialogExample,
}

export default meta

type Story = StoryObj<typeof DialogExample>

export const Default: Story = {
  args: {
    longContent: false,
    size: "md",
    scrollBody: false,
    showHeader: true,
    showFooter: false,
  },
  argTypes: {
    size: {
      control: {
        type: "select",
      },
      options: ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"],
    },
  },
}

const DynamicDialogContent = ({ longContent }: { longContent?: boolean }) => {
  if (!longContent) return <p>This is a simple dialog.</p>

  return (
    <>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a luctus
        lorem. Etiam aliquam vel est vel lacinia. Nulla vehicula tortor quis erat
        pellentesque, et interdum nisl aliquet. Aenean ac malesuada mauris. Aliquam
        scelerisque lorem ut metus interdum, ut venenatis orci egestas. In semper
        mollis eros lobortis mollis. Praesent vestibulum convallis ipsum at
        fermentum. Donec porta facilisis lacus eu dignissim. Proin hendrerit orci
        gravida risus commodo fermentum. Donec finibus sapien eu nibh mattis dictum.
        Praesent ac tempor odio, et lobortis ex. Donec nec mauris et lorem facilisis
        auctor. Maecenas vitae convallis leo.
      </p>
      <p>
        Maecenas maximus felis scelerisque turpis euismod rutrum. Pellentesque a
        dolor scelerisque, elementum sapien eu, porta libero. Donec volutpat egestas
        tincidunt. Vivamus blandit eros mollis viverra aliquam. Mauris eu turpis id
        est gravida finibus. In viverra, elit eget eleifend sagittis, massa quam
        faucibus erat, sed mattis odio nunc vitae enim. Donec lacus diam, lobortis at
        facilisis in, placerat ut diam. Maecenas sed dui sit amet massa tristique
        vulputate non ac erat. Nullam orci urna, finibus eu blandit et, pharetra ac
        enim. Donec magna augue, interdum at sollicitudin id, fringilla nec sapien.
        In nisl quam, rhoncus blandit ipsum in, volutpat aliquam nisi. Nam accumsan
        lobortis ante, at tristique ante vehicula eget. Sed ornare varius velit, ut
        ultrices ante auctor non. Cras bibendum, libero sed varius fringilla, quam
        lorem fermentum nunc, vitae varius mauris libero sed tortor.
      </p>
      <p>
        Donec ut aliquam massa. Etiam congue turpis at purus tempor maximus. Etiam
        semper libero non varius pellentesque. Ut egestas faucibus purus non
        faucibus. Duis sed nisi consequat, laoreet nisi in, laoreet purus. Integer
        aliquam mi ac metus interdum rhoncus. In ac iaculis quam. Sed eu nibh lectus.
        Donec imperdiet vestibulum nisl in facilisis. Sed molestie ipsum eu orci
        imperdiet cursus. Morbi sit amet quam mi. Etiam maximus scelerisque orci, id
        gravida ligula sagittis in. Maecenas volutpat quam elit, vel vehicula ex
        fringilla ac. Aenean risus lectus, pellentesque id est eget, feugiat
        hendrerit ligula. Nulla tempor pulvinar lacus, ut euismod tortor.
      </p>
    </>
  )
}
