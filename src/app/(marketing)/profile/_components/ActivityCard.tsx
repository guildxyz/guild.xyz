"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { Guild } from "@guildxyz/types"
import Color from "color"
import { ActivityLogActionResponse } from "components/[guild]/activity/ActivityLogContext"
import { ActivityLogAction } from "components/[guild]/activity/constants"
import ClientOnly from "components/common/ClientOnly"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import useSWRImmutable from "swr/immutable"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import { useProfile } from "../_hooks/useProfile"
import { ActionLabel } from "./ActionLabel"

export const ActivityCard = ({ activity }: { activity: ActivityLogAction }) => {
  const { data: guildLatest, error } = useSWRImmutable<Guild>(
    activity.ids.guild ? `/v2/guilds/${activity.ids.guild}` : null,
    { shouldRetryOnError: false }
  )
  const profile = useProfile()
  const { data: guildFallback } = useSWRWithOptionalAuth<ActivityLogActionResponse>(
    activity.ids.guild && error && profile.data
      ? `/v2/audit-log?guildId=${activity.ids.guild}&limit=1&userId=${profile.data.userId}`
      : null
  )
  const guild = guildLatest
    ? { ...guildLatest, ...guildLatest?.theme }
    : guildFallback?.entries.at(0)?.data
  const color = Color(guild?.color)

  return (
    <Card className="flex">
      {guild && (
        <div
          className="flex h-full w-9 items-center justify-center bg-accent"
          style={{ background: guild.color }}
        >
          <div className="-rotate-90 flex items-center gap-1">
            <Avatar size="xs">
              <AvatarImage
                width={24}
                height={24}
                src={guild.imageUrl}
                alt="guild avatar"
              />
              <AvatarFallback />
            </Avatar>
            <span
              className={cn(
                "max-w-14 truncate font-bold font-display text-sm",
                color && color.isDark() ? "text-white" : "text-black"
              )}
            >
              {guild.name}
            </span>
          </div>
        </div>
      )}
      <div className="px-5 py-6">
        <h3 className="space-x-1.5 font-bold">
          <ActionLabel activity={activity} />
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <ClientOnly>
            <p className="text-muted-foreground">
              {formatRelativeTimeFromNow(Date.now() - parseInt(activity.timestamp))}{" "}
              ago
            </p>
          </ClientOnly>
        </div>
      </div>
    </Card>
  )
}
