import { Guild, Role, Schemas } from "@guildxyz/types"
import fetcher from "utils/fetcher"
import { ContributionCardView } from "./ContributionCardView"

export const ContributionCard = async ({
  contribution,
}: { contribution: Schemas["ProfileContribution"] }) => {
  const guild = (await fetcher(`/v2/guilds/${contribution.guildId}`)) as Guild
  const role = (await fetcher(
    `/v2/guilds/${contribution.guildId}/roles/${contribution.roleId}`
  )) as Role
  return <ContributionCardView guild={guild} role={role} />
}
