"use client"

import { Guild, Role, Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import { ContributionCardView } from "./ContributionCardView"

export const ContributionCard = ({
  contribution,
}: { contribution: Schemas["Contribution"] }) => {
  const guild = useSWRImmutable<Guild>(`/v2/guilds/${contribution.guildId}`)
  const role = useSWRImmutable<Role>(
    `/v2/guilds/${contribution.guildId}/roles/${contribution.roleId}`
  )
  if (!role.data || !guild.data) return
  return <ContributionCardView guild={guild.data} role={role.data} />
}
