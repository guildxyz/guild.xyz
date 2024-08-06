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
import { useYourGuilds } from "@/hooks/useYourGuilds"
// import { profileSchema } from "@/lib/validations/profileSchema"
import { Guild, Schemas } from "@guildxyz/types"
// import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "@phosphor-icons/react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useAtom } from "jotai"
import { FormProvider, useForm } from "react-hook-form"
import useSWR from "swr"
import fetcher from "utils/fetcher"
import { contributionsAtom } from "../[username]/atoms"
import { useAllRoles } from "../_hooks/useAllRoles"
import { ProfileId, useEditContribution } from "../_hooks/useEditContribution"
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

export const EditContributions = ({
  userId,
  profileId,
}: ProfileId & Pick<Schemas["Profile"], "userId">) => {
  const form = useForm<
    Schemas["ProfileContributionUpdate"] & {
      firstContribution: Schemas["ProfileContributionUpdate"]
      secondContribution: Schemas["ProfileContributionUpdate"]
      thirdContribution: Schemas["ProfileContributionUpdate"]
    }
  >({
    // resolver: zodResolver(profileSchema),
    // defaultValues: {
    //   ...contribution,
    // },
    mode: "onTouched",
  })

  // const guilds = allRoles.data?.reduce<ExtendedContribution[]>(
  //   (acc, cur) =>
  //     acc.some(({ guild }) => guild.id === cur.guild.id) ? acc : [...acc, cur],
  //   []
  // )
  const allRoles = useAllRoles(userId)
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
  // const guilds: Guild[] = []
  // selectedId === undefined
  //   ? undefined
  //   : guilds?.filter((d) => d.guild.id === parseInt(selectedId))

  // useEffect(() => {
  //   if (roles === undefined) {
  //     form.setValue("guildId", undefined)
  //   }
  // }, [roles, form])

  const [contributions, setContributions] = useAtom(contributionsAtom)
  const editContribution = useEditContribution({ profileId })
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
                {(
                  [
                    "firstContribution",
                    "secondContribution",
                    "thirdContribution",
                  ] as const
                ).map((fieldName) => (
                  <FormField
                    control={form.control}
                    name={fieldName}
                    key={fieldName}
                    render={({ field }) => {
                      const guild = guilds?.find(
                        (guild) => field.value && guild.id === field.value.guildId
                      )
                      if (!guild) return <></>
                      const roles = allRoles.data?.filter(
                        (role) => role.guildId === guild.id
                      )

                      return (
                        <FormItem>
                          <CardWithGuildLabel guild={guild}>
                            <div className="flex flex-col gap-4 p-6">
                              <FormLabel className="font-extrabold text-muted-foreground text-xs uppercase">
                                TOP ROLE
                              </FormLabel>
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
                                  {roles?.map((data) => (
                                    <SelectItem
                                      key={data.id}
                                      value={data.id.toString()}
                                    >
                                      {data.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </CardWithGuildLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
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
                                {data.name}
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
                        <FormLabel aria-disabled={!roles}>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          disabled={!roles}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select from your roles" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles?.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
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
