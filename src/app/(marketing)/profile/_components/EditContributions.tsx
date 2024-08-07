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
import { Label } from "@/components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { useToast } from "@/components/ui/hooks/useToast"
import { useYourGuilds } from "@/hooks/useYourGuilds"
import { Guild, Schemas } from "@guildxyz/types"
import { Pencil, X } from "@phosphor-icons/react"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useState } from "react"
import useSWR from "swr"
import fetcher from "utils/fetcher"
import { useAllUserRoles } from "../_hooks/useAllUserRoles"
import { useContribution } from "../_hooks/useContribution"
import { useCreateContribution } from "../_hooks/useCreateContribution"
import { useDeleteContribution } from "../_hooks/useDeleteContribution"
import { useUpdateContribution } from "../_hooks/useUpdateContribution"
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
  const { data: allRoles } = useAllUserRoles()
  const editContribution = useUpdateContribution({ contributionId: contribution.id })
  const deleteContribution = useDeleteContribution({
    contributionId: contribution.id,
  })
  if (!guild || !allRoles) return
  const roles = allRoles.filter((role) => role.guildId === guild.id)

  return (
    <CardWithGuildLabel guild={guild}>
      <div className="relative flex flex-col gap-4 p-6">
        <Button
          size="icon"
          variant="ghost"
          onClick={deleteContribution.onSubmit}
          isLoading={deleteContribution.isLoading}
          className="absolute top-2 right-2 size-7"
        >
          <X />
        </Button>
        <Label className="font-extrabold text-muted-foreground text-xs uppercase">
          TOP ROLE
        </Label>
        <Select
          defaultValue={contribution.roleId.toString()}
          onValueChange={(value) => {
            editContribution.onSubmit({ roleId: parseInt(value), guildId: guild.id })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select from your guilds" />
          </SelectTrigger>
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
  const allRoles = useAllUserRoles()
  const [guildId, setGuildId] = useState("")
  const [roleId, setRoleId] = useState("")
  const { toast } = useToast()

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
  const selectedId = guildId
  const roles = allRoles.data?.filter(
    (role) => role.guildId.toString() === selectedId
  )
  const createContribution = useCreateContribution()
  console.log(contributions.data)

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
        <DialogBody className="gap-7">
          <div className="flex flex-col gap-3">
            {contributions.data?.slice(0, 3).map((contribution) => (
              <EditContributionCard
                contribution={contribution}
                key={contribution.id}
              />
            ))}
          </div>
          <div className="">
            <h3 className="mb-3 font-semibold text-muted-foreground">
              Add contribution
            </h3>
            <Card className="flex flex-col gap-2 border border-dashed bg-card-secondary p-5">
              <div className="pb-2">
                <Label>Guild</Label>
                <Select onValueChange={setGuildId} value={guildId} key={guildId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select from your guilds" />
                  </SelectTrigger>
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
              </div>
              <div className="pb-2">
                <Label aria-disabled={!roles?.length}>Role</Label>
                <Select
                  key={roleId}
                  onValueChange={setRoleId}
                  value={roleId}
                  disabled={!roles?.length || !guildId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select from your roles" />
                  </SelectTrigger>
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
              </div>
              <Button
                colorScheme="success"
                className="self-end"
                disabled={!roleId || !guildId}
                isLoading={createContribution.isLoading}
                onClick={() => {
                  if (contributions.data && contributions.data.length >= 3) {
                    toast({
                      title: "Cannot add more than 3 contributions",
                      description: "Please remove one first before adding a new one",
                      variant: "error",
                    })
                    return
                  }
                  createContribution.onSubmit({
                    guildId: parseInt(guildId),
                    roleId: parseInt(roleId),
                  })
                }}
              >
                Add
              </Button>
            </Card>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
