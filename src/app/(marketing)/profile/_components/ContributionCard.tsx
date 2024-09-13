import { Skeleton } from "@/components/ui/Skeleton"
import { Guild, Role, Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import { useProfile } from "../_hooks/useProfile"
import { ContributionCardView } from "./ContributionCardView"

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

  if (!role.data || !guild.data) {
    return <Skeleton className="h-32 w-full rounded-2xl" />
  }

  return (
    <ContributionCardView
      guild={guild.data}
      role={role.data}
      collection={collection.data}
    />
  )
}
