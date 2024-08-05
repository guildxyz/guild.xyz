"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
// import { profileSchema } from "@/lib/validations/profileSchema"
import { Schemas } from "@guildxyz/types"
// import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "@phosphor-icons/react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useAtom } from "jotai"
import { FormProvider, useForm } from "react-hook-form"
import { contributionsAtom } from "../[username]/atoms"
import { useAllContribution } from "../_hooks/useAllContribution"
import { ContributionCard } from "./ContributionCard"

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
  const allContributions = useAllContribution()
  const [contributions, setContributions] = useAtom(contributionsAtom)
  async function onSubmit(values: Schemas["ProfileContributionUpdate"]) {
    console.log("edit contributions submit", values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="solid" size="icon" className="rounded-full">
          <Pencil weight="bold" />
        </Button>
      </DialogTrigger>
      <DialogContent size="lg" className="bg-background">
        <DialogHeader>
          <DialogTitle>Edit top contributions</DialogTitle>
          <DialogDescription />
          <DialogCloseButton />
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody className="gap-7">
              <div>
                {contributions?.map(({ guild, roles }) =>
                  roles.map((role) => (
                    <ContributionCard key={guild.id} role={role} guild={guild} />
                  ))
                )}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="mb-8">Add contribution</h3>
                <Card className="flex flex-col gap-2 border-dashed bg-card-secondary">
                  <FormField
                    control={form.control}
                    name="guildId"
                    render={({ field }) => (
                      <FormItem className="pb-2">
                        <FormLabel>Guild</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select from your guilds" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {allContributions.data?.map((data) => (
                              <SelectItem value={data.guild.id.toString()}>
                                {data.guild.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Button
                    colorScheme="success"
                    type="submit"
                    className="self-end"
                    disabled={!form.formState.isValid}
                  >
                    Add
                  </Button>
                </Card>
              </div>
            </DialogBody>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
