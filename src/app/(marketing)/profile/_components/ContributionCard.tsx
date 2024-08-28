"use client"

import { Guild, Role, Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { useProfile } from "../_hooks/useProfile"
import { ContributionCardView } from "./ContributionCardView"

type Collection = Schemas["ContributionCollection"]
export type Point = {
  id: number
  platformId: number
  platformGuildId: string
  platformGuildData: {
    name: string
    imageUrl: string
  }
}
export interface ExtendedCollection extends Collection {
  // TODO: move this override type to backend
  points: (Collection["points"][number] & Point)[]
}

export const ContributionCard = ({
  contribution,
}: { contribution: Schemas["Contribution"] }) => {
  const guild = useSWRImmutable<Guild>(`/v2/guilds/${contribution.guildId}`)
  const role = useSWRImmutable<Role>(
    `/v2/guilds/${contribution.guildId}/roles/${contribution.roleId}`
  )
  const profile = useProfile()
  const collection = useSWRImmutable<Schemas["ContributionCollection"]>(
    profile.data
      ? `/v2/profiles/${profile.data.username}/contributions/${contribution.id}/collection`
      : null
  )
  const points = useSWRImmutable<Point[]>(
    collection.data?.points
      ? collection.data.points.map(
          ({ guildId, guildPlatformId }) =>
            `/v2/guilds/${guildId}/guild-platforms/${guildPlatformId}`
        )
      : null,
    (args) => Promise.all(args.map((arg) => fetcher(arg)))
  )
  if (!role.data || !guild.data || !collection.data || !points.data) return

  collection.data.points = collection.data.points.map((rawPoints, i) => ({
    ...rawPoints,
    ...points.data?.at(i),
  }))

  return (
    <ContributionCardView
      guild={guild.data}
      role={role.data}
      collection={collection.data as ExtendedCollection}
    />
  )
}
