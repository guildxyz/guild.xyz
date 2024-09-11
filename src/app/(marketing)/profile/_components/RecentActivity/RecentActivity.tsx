"use client"

import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { ActivityLogActionResponse } from "components/[guild]/activity/ActivityLogContext"
import { ACTION } from "components/[guild]/activity/constants"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { atom, useAtom } from "jotai"
import { useState } from "react"
import { useProfile } from "../../_hooks/useProfile"
import { ActivityCard } from "./ActivityCard"

const ACTIVITY_FILTERS = ["All", "Editing", "Join", "Rewards"] as const
const FILTER_ACTIONS: Record<(typeof ACTIVITY_FILTERS)[number], ACTION[]> = {
  All: [
    ACTION.JoinGuild,
    ACTION.LeaveGuild,
    ACTION.CreateGuild,
    ACTION.CreateRole,
    ACTION.DeleteRole,
    ACTION.DeleteGuild,
    ACTION.AddReward,
    ACTION.RemoveReward,
    ACTION.GetReward,
    ACTION.LoseReward,
  ],
  Join: [
    ACTION.JoinGuild,
    ACTION.LeaveGuild,
    // ACTION.CreateProfile,
    // ACTION.ReferProfile,
  ] as const,
  Editing: [
    ACTION.CreateGuild,
    ACTION.CreateRole,
    ACTION.DeleteRole,
    ACTION.DeleteGuild,
    ACTION.AddReward,
    ACTION.RemoveReward,
  ] as const,
  Rewards: [ACTION.GetReward, ACTION.LoseReward] as const,
}

export const activityValuesAtom = atom<ActivityLogActionResponse["values"] | null>(
  null
)

export const RecentActivity = () => {
  const [activityFilter, setActivityFilter] =
    useState<(typeof ACTIVITY_FILTERS)[number]>("All")
  const [_, setActivityValues] = useAtom(activityValuesAtom)
  const profile = useProfile()
  const searchParams =
    profile.data?.userId &&
    new URLSearchParams([
      ["username", profile.data.username],
      ["userId", profile.data.userId.toString()],
      ["limit", "20"],
      ["offset", "0"],
      ...FILTER_ACTIONS[activityFilter].map((action) => ["action", action]),
    ])
  const auditLog = useSWRWithOptionalAuth<ActivityLogActionResponse>(
    searchParams ? `/v2/audit-log?${searchParams}` : null,
    {
      // for some reason, ts errors on the setActivityValues part
      // @ts-ignore
      onSuccess: (data) => setActivityValues(data.values),
    }
  )

  return (
    <>
      <ToggleGroup
        type="single"
        variant="primary"
        size="sm"
        className="mb-4 gap-1.5"
        onValueChange={(value) =>
          value && setActivityFilter(value as (typeof ACTIVITY_FILTERS)[number])
        }
        value={activityFilter}
      >
        {ACTIVITY_FILTERS.map((filter) => (
          <ToggleGroupItem value={filter} key={filter}>
            {filter}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {auditLog.isLoading ? (
          Array.from({ length: 20 }, (_, i) => (
            <Card key={i}>
              <Skeleton className="h-[102px] w-full" />
            </Card>
          ))
        ) : auditLog.data?.entries?.length ? (
          <>
            {auditLog.data.entries.map((activity) => (
              <ActivityCard activity={activity} key={activity.id} />
            ))}
            {auditLog.data?.entries?.length >= 20 && (
              <p className="col-span-full mt-2 font-semibold text-muted-foreground">
                &hellip; only last 20 actions are shown
              </p>
            )}
          </>
        ) : (
          <p className="mt-2 font-semibold text-muted-foreground">
            No recent actions
          </p>
        )}
      </div>
    </>
  )
}
