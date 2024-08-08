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
import { Guild, MembershipResult, Role, Schemas } from "@guildxyz/types"
import { X } from "@phosphor-icons/react"
import { PencilSimple } from "@phosphor-icons/react"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useState } from "react"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { useContribution } from "../_hooks/useContribution"
import { useCreateContribution } from "../_hooks/useCreateContribution"
import { useDeleteContribution } from "../_hooks/useDeleteContribution"
import { useMemberships } from "../_hooks/useMemberships"
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
  return { guilds: useSWRImmutable(requests, guildFetcher), baseGuilds: yourGuilds }
}

const EditContributionCard = ({
  contribution,
}: { contribution: Schemas["Contribution"] }) => {
  const { data: guild } = useSWRImmutable<Guild>(
    `/v2/guilds/${contribution.guildId}`,
    fetcher
  )
  const memberships = useMemberships()
  const editContribution = useUpdateContribution({ contributionId: contribution.id })
  const deleteContribution = useDeleteContribution({
    contributionId: contribution.id,
  })
  if (!guild || !memberships.data) return
  const roleIds = memberships.data.find(
    (membership) => membership.guildId === guild.id
  )?.roleIds

  return (
    <CardWithGuildLabel guild={guild}>
      <div className="relative flex flex-col gap-2 p-6">
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
            {roleIds?.map((roleId) => (
              <RoleSelectItem roleId={roleId} guildId={guild.id} key={roleId} />
            ))}
          </SelectContent>
        </Select>
      </div>
    </CardWithGuildLabel>
  )
}

export const EditContributions = () => {
  const contributions = useContribution()
  const memberships = useMemberships()
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

  const roleIds = memberships.data?.find(
    (membership) => membership.guildId.toString() === guildId
  )?.roleIds
  const createContribution = useCreateContribution()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="solid" size="icon-sm" className="rounded-full">
          <PencilSimple weight="bold" />
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
                <Select
                  onValueChange={(value) => {
                    setGuildId(value)
                    setRoleId("")
                  }}
                  value={guildId}
                >
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
                <Label aria-disabled={!roleIds?.length}>Role</Label>
                <Select
                  onValueChange={setRoleId}
                  value={roleId}
                  disabled={!roleIds?.length || !guildId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select from your roles" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleIds?.map((roleId) => (
                      <RoleSelectItem
                        roleId={roleId}
                        guildId={parseInt(guildId)}
                        key={roleId}
                      />
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
const RoleSelectItem = ({
  roleId,
  guildId,
}: Pick<MembershipResult, "guildId"> & {
  roleId: MembershipResult["roleIds"][number]
}) => {
  const { data: data } = useSWRImmutable<Role>(
    `/v2/guilds/${guildId}/roles/${roleId}`
  )
  if (!data) return
  return (
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
  )
}
