"use client"

import { Badge } from "@/components/ui/Badge"
import { useAtomValue } from "jotai"
import { FunctionComponent } from "react"
import rewards from "rewards"
import { PlatformType } from "types"
import { BadgeSkeleton } from "./BadgeSkeleton"
import { activityValuesAtom } from "./RecentActivity"

export const RewardBadge: FunctionComponent<{
  guildId?: number
  roleId?: number
  rolePlatformId?: number
}> = ({ roleId, rolePlatformId }) => {
  const activityValues = useAtomValue(activityValuesAtom)

  if (!activityValues) return <BadgeSkeleton />

  const reward = activityValues.rolePlatforms.find((rp) => rp.id === rolePlatformId)
  const role = activityValues.roles.find((r) => r.id === roleId)

  const rewardName = reward?.platformGuildName ?? reward?.data?.name
  const name =
    reward?.platformId === PlatformType.DISCORD
      ? (role?.name ?? "Unknown role")
      : rewardName

  const Icon = rewards[reward?.platformName]?.icon
  const colorScheme = rewards[reward?.platformName]?.colorScheme

  if (!reward) return <Badge variant="outline">Deleted reward</Badge>

  return (
    <Badge
      // this only works for platform colors, but we have simple "blue" or "gold" colorSchemes for reward types too, so we'll have to handle that
      style={{ background: `hsl(var(--${colorScheme.toLowerCase()}))` }}
      className="text-white"
    >
      <Icon />
      {name}
    </Badge>
  )
}
