"use client"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Pencil } from "@phosphor-icons/react"

export const EditProfile = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="-top-8 absolute right-0" variant="solid">
          <Pencil weight="bold" />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <Label>
            <div>Bio</div>
            <Input />
          </Label>
        </DialogBody>
        <DialogFooter>
          <Button colorScheme="success">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
