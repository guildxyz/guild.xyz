"use client"

import { Guild, Role, Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { ContributionCardView } from "./ContributionCardView"

export const ContributionCard = ({
  contribution,
}: { contribution: Schemas["Contribution"] }) => {
  const guild = useSWRImmutable<Guild>(`/v2/guilds/${contribution.guildId}`, fetcher)
  const role = useSWRImmutable<Role>(
    `/v2/guilds/${contribution.guildId}/roles/${contribution.roleId}`,
    fetcher
  )
  if (!role.data || !guild.data) return
  return <ContributionCardView guild={guild.data} role={role.data} />
}
