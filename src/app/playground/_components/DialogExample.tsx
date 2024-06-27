import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to Guild</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogHeader>

        <p>This is the dialog content</p>
      </DialogContent>
    </Dialog>
  )
}
