import { Guild, Role, Schemas } from "@guildxyz/types"
import useSWR from "swr"
import fetcher from "utils/fetcher"
import { ContributionCardView } from "./ContributionCardView"

export const ContributionCard = ({
  contribution,
}: { contribution: Schemas["ProfileContribution"] }) => {
  const guild = useSWR<Guild>(`/v2/guilds/${contribution.guildId}`, fetcher)
  const role = useSWR<Role>(
    `/v2/guilds/${contribution.guildId}/roles/${contribution.roleId}`,
    fetcher
  )
  if (!role.data || !guild.data) return
  return <ContributionCardView guild={guild.data} role={role.data} />
}
