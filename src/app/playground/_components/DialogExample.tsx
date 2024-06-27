import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"

const DialogExample = () => (
  <Dialog>
    <DialogTrigger>Open</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Connect to Guild</DialogTitle>
        <DialogDescription>Description</DialogDescription>
      </DialogHeader>

      <p>This is the dialog content</p>
    </DialogContent>
  </Dialog>
)

export { DialogExample }
