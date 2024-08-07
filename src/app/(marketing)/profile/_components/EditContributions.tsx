"use client"

import { Avatar, AvatarImage } from "@/components/ui/Avatar"
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
import { useYourGuilds } from "@/hooks/useYourGuilds"
// import { profileSchema } from "@/lib/validations/profileSchema"
import { Guild, Schemas } from "@guildxyz/types"
// import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "@phosphor-icons/react"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { DialogDescription } from "@radix-ui/react-dialog"
import { FormProvider, useForm } from "react-hook-form"
import useSWR from "swr"
import fetcher from "utils/fetcher"
import { useAllUserRoles } from "../_hooks/useAllUserRoles"
import { useContribution } from "../_hooks/useContribution"
import { useCreateContribution } from "../_hooks/useCreateContribution"
import { CardWithGuildLabel } from "./CardWithGuildLabel"

const guildFetcher = (urls: string[]) => {
  return Promise.all(urls.map((url) => fetcher(url) as Promise<Guild>))
}
const useYourVerifiedGuild = () => {
  const yourGuilds = useYourGuilds()
  const requests = yourGuilds.data
    ? yourGuilds.data.map((guild) => `/v2/guilds/${guild.id}`)
    : null
  return { guilds: useSWR(requests, guildFetcher), baseGuilds: yourGuilds }
}

const EditContributionCard = ({
  contribution,
}: { contribution: Schemas["ProfileContribution"] }) => {
  const { data: guild } = useSWR(`/v2/guilds/${contribution.guildId}`, fetcher)
  const { data: roles } = useAllUserRoles()
  if (!guild) return

  return (
    <CardWithGuildLabel guild={guild}>
      <div className="flex flex-col gap-4 p-6">
        <FormLabel className="font-extrabold text-muted-foreground text-xs uppercase">
          TOP ROLE
        </FormLabel>
        <Select
          defaultValue={contribution.roleId.toString()}
          onValueChange={(value) => {
            console.log("edit to", value)
            // editContribution.onSubmit()
            // .mutate((data) => {
            // data[i] =
            // })
          }}
          // defaultValue={field.value?.role.id.toString()}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select from your guilds" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {roles?.map((data) => (
              <SelectItem key={data.id} value={data.id.toString()}>
                {data.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CardWithGuildLabel>
  )
}

export const EditContributions = () => {
  const contributions = useContribution()
  console.log(contributions)
  const form = useForm<Schemas["ProfileContributionUpdate"]>({
    mode: "onTouched",
  })
  const allRoles = useAllUserRoles()
  const {
    guilds: { data: guildData },
    baseGuilds,
  } = useYourVerifiedGuild()
  const guilds =
    guildData &&
    baseGuilds.data?.reduce<Guild[]>(
      (acc, curr, i) =>
        curr.tags.includes("VERIFIED") ? [...acc, guildData[i]] : acc,
      []
    )
  const selectedId = form.watch("guildId") as unknown as string
  const roles = allRoles.data?.filter(
    (role) => role.guildId.toString() === selectedId
  )
  const editContribution = useCreateContribution()
  async function onSubmit(values: Schemas["ProfileContributionUpdate"]) {
    editContribution.onSubmit(values)
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
              <div className="flex flex-col gap-3">
                {contributions.data?.slice(0, 3).map((contribution, i) => {
                  // const roles = allRoles.data?.filter(
                  //   (role) => role.guildId === guild.id
                  // )
                  return <EditContributionCard contribution={contribution} />
                })}
              </div>
              <div className="">
                <h3 className="mb-3 font-semibold text-muted-foreground">
                  Add contribution
                </h3>
                <Card className="flex flex-col gap-2 border border-dashed bg-card-secondary p-5">
                  <FormField
                    control={form.control}
                    name="guildId"
                    render={({ field }) => (
                      <FormItem className="pb-2">
                        <FormLabel>Guild</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select from your guilds" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {guilds?.map((data) => (
                              <SelectItem key={data.id} value={data.id.toString()}>
                                <div className="flex gap-2">
                                  <Avatar size="xs">
                                    <AvatarImage
                                      src={data.imageUrl}
                                      width={32}
                                      height={32}
                                      alt="guild avatar"
                                    />
                                    <AvatarFallback />
                                  </Avatar>
                                  {data.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                      <FormItem className="pb-2">
                        <FormLabel aria-disabled={!roles?.length}>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          disabled={!roles?.length}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select from your roles" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles?.map((data) => (
                              <SelectItem key={data.id} value={data.id.toString()}>
                                <div className="flex gap-2">
                                  <Avatar size="xs">
                                    <AvatarImage
                                      src={data.imageUrl}
                                      width={32}
                                      height={32}
                                      alt="guild avatar"
                                    />
                                    <AvatarFallback />
                                  </Avatar>
                                  {data.name}
                                </div>
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
                    disabled={!form.watch("roleId") || !form.watch("guildId")}
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
