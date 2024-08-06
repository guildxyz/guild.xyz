"use client"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
// import { profileSchema } from "@/lib/validations/profileSchema"
import { Schemas } from "@guildxyz/types"
// import { zodResolver } from "@hookform/resolvers/zod"
import { PencilSimple } from "@phosphor-icons/react"
import { FormProvider, useForm } from "react-hook-form"

export const EditContributions = (
  contribution: Schemas["ProfileContributionUpdate"]
) => {
  const form = useForm<Schemas["ProfileContributionUpdate"]>({
    // resolver: zodResolver(profileSchema),
    defaultValues: {
      ...contribution,
    },
    mode: "onTouched",
  })

  async function onSubmit(values: Schemas["ProfileContributionUpdate"]) {
    console.log("edit contributions submit", values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="solid" size="icon-sm" className="rounded-full">
          <PencilSimple weight="bold" />
        </Button>
      </DialogTrigger>
      <DialogContent size="lg" className="bg-background">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <Button
                colorScheme="success"
                type="submit"
                disabled={!form.formState.isValid}
              >
                Add
              </Button>
            </DialogBody>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
