"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
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
import { WarningCircle, X } from "@phosphor-icons/react"
import { PencilSimple } from "@phosphor-icons/react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useState } from "react"
import useSWRImmutable from "swr/immutable"
import { useContributions } from "../_hooks/useContributions"
import { useCreateContribution } from "../_hooks/useCreateContribution"
import { useDeleteContribution } from "../_hooks/useDeleteContribution"
import { useMemberships } from "../_hooks/useMemberships"
import { useUpdateContribution } from "../_hooks/useUpdateContribution"
import { CardWithGuildLabel } from "./CardWithGuildLabel"

const EditContributionCard = ({
  contribution,
}: { contribution: Schemas["Contribution"] }) => {
  const { data: guild } = useSWRImmutable<Guild>(
    `/v2/guilds/${contribution.guildId}`
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
  const contributions = useContributions()
  const memberships = useMemberships()
  const [guildId, setGuildId] = useState("")
  const [roleId, setRoleId] = useState("")
  const { toast } = useToast()

  const { data: baseGuilds } = useYourGuilds()
  const guilds = baseGuilds?.filter(({ tags }) => tags.includes("VERIFIED"))

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
          <DialogDescription className="sr-only" />
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody className="gap-7">
          <div className="flex flex-col gap-3">
            {guilds && guilds.length === 0 && (
              <Card className="flex gap-2 border border-destructive-subtle p-4 text-destructive-subtle">
                <WarningCircle size={32} weight="fill" />
                <h3 className="font-medium">
                  You have no verified guild membership to select from
                </h3>
              </Card>
            )}
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
                  disabled={guilds?.length === 0}
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
                      <GuildSelectItem key={data.id} guildId={data.id} />
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
                  setGuildId("")
                  setRoleId("")
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

const GuildSelectItem = ({ guildId }: Pick<MembershipResult, "guildId">) => {
  const { data } = useSWRImmutable<Guild>(`/v2/guilds/${guildId}`)
  if (!data) return
  return (
    <SelectItem value={data.id.toString()}>
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
        <span className="line-clamp-1">{data.name}</span>
      </div>
    </SelectItem>
  )
}
