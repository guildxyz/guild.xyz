"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { Guild } from "@guildxyz/types"
import { ActivityLogAction } from "components/[guild]/activity/constants"
import ClientOnly from "components/common/ClientOnly"
import useSWRImmutable from "swr/immutable"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import { ActionLabel } from "./ActionLabel"

export const ActivityCard = ({ activity }: { activity: ActivityLogAction }) => {
  const { data: guild } = useSWRImmutable<Guild>(
    activity.ids.guild ? `/v2/guilds/${activity.ids.guild}` : null
  )

  return (
    <Card className="flex">
      {guild && (
        <div
          className="flex h-full w-9 items-center justify-center border-border border-r-2 bg-accent"
          style={{ background: guild.theme.color }}
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
            <span className="max-w-14 truncate font-bold font-display text-sm">
              {guild.name}
            </span>
          </div>
        </div>
      )}
      <div className="px-5 py-6">
        <h3 className="space-x-1.5 font-bold">
          <ActionLabel activity={activity} />
          {/*Acquire the{" "}
          <Badge className="whitespace-nowrap">
            <Rocket weight="fill" className="mr-1" />
            Enter Farcaster
          </Badge>{" "}
          role*/}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <ClientOnly>
            <p className="text-muted-foreground">
              {formatRelativeTimeFromNow(Date.now() - parseInt(activity.timestamp))}{" "}
              ago
            </p>
          </ClientOnly>
          {/*<Circle
            className="hidden size-1.5 text-muted-foreground sm:block"
            weight="fill"
          />*/}
        </div>
      </div>
    </Card>
  )
}
