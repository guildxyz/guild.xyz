"use client"

import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { ActivityLogActionResponse } from "components/[guild]/activity/ActivityLogContext"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useMemo, useState } from "react"
import { useProfile } from "../../_hooks/useProfile"
import { ActivityCard } from "./ActivityCard"

// TODO: these are duplicated types (and extended), we should move them to
// backend types
enum ACTION {
  // Guild
  CreateGuild = "create guild",
  UpdateGuild = "update guild",
  DeleteGuild = "delete guild",
  ExecutePendingActions = "execute pending actions",
  TransferOwnership = "transfer ownership",
  // Guild update
  AddAdmin = "add admin",
  RemoveAdmin = "remove admin",
  ShowMembersOn = "show members on",
  ShowMembersOff = "show members off",
  HideFromExplorerOn = "hide from explorer on",
  HideFromExplorerOff = "hide from explorer off",
  // Role
  CreateRole = "create role",
  UpdateRole = "update role",
  DeleteRole = "delete role",
  // Form
  CreateForm = "create form",
  UpdateForm = "update form",
  DeleteForm = "delete form",
  SubmitForm = "submit form",
  // Reward
  AddReward = "add reward",
  RemoveReward = "remove reward",
  UpdateReward = "update reward",
  // Requirement
  AddRequirement = "add requirement",
  UpdateRequirement = "update requirement",
  RemoveRequirement = "remove requirement",
  // Status update
  StartStatusUpdate = "start status update",
  RestartStatusUpdate = "restart status update",
  StopStatusUpdate = "stop status update",
  // User
  ClickJoinOnPlatform = "click join on platform",
  JoinGuild = "join guild",
  LeaveGuild = "leave guild",
  KickFromGuild = "kick from guild",
  UserStatusUpdate = "user status update",
  GetRole = "get role",
  LoseRole = "lose role",
  SendReward = "send reward",
  GetReward = "get reward",
  RevokeReward = "revoke reward",
  LoseReward = "lose reward",
  ConnectIdentity = "connect identity",
  DisconnectIdentity = "disconnect identity",
  OptIn = "user opt-in",
  OptOut = "user opt-out",
  // Profile
  UpdateProfile = "update profile",
  CreateProfile = "create profile",
  DeleteProfile = "delete profile",
  ReferProfile = "refer profile",
}

const ACTIVITY_FILTERS = ["All", "Editing", "Join", "Rewards"] as const
const FILTER_ACTIONS: Record<
  Exclude<(typeof ACTIVITY_FILTERS)[number], "All">,
  ACTION[]
> = {
  Join: [
    ACTION.JoinGuild,
    ACTION.CreateGuild,
    ACTION.CreateProfile,
    ACTION.ReferProfile,
  ] as const,
  Editing: [
    ACTION.LeaveGuild,
    ACTION.KickFromGuild,
    ACTION.UpdateGuild,
    ACTION.UpdateProfile,
    ACTION.DeleteProfile,
    ACTION.CreateRole,
    ACTION.DeleteRole,
    ACTION.DeleteGuild,
    ACTION.AddReward,
    ACTION.UpdateReward,
    ACTION.RemoveReward,
    ACTION.AddAdmin,
  ] as const,
  Rewards: [ACTION.RevokeReward, ACTION.LoseReward, ACTION.SendReward] as const,
}
const THIRTY_DAYS_IN_MS = 30 * 86400 * 1000

export const RecentActivity = () => {
  const [activityFilter, setActivityFilter] =
    useState<(typeof ACTIVITY_FILTERS)[number]>("All")
  const profile = useProfile()
  const lastMonthApprox = useMemo(() => Date.now() - THIRTY_DAYS_IN_MS, [])
  const searchParams =
    profile.data?.userId &&
    new URLSearchParams([
      ["username", profile.data.username],
      ["userId", profile.data.userId.toString()],
      ["limit", "20"],
      ["offset", "0"],
      ["after", lastMonthApprox.toString()],
      ...(activityFilter === "All"
        ? Array.from(new Set(Object.values(FILTER_ACTIONS).flat()))
        : FILTER_ACTIONS[activityFilter]
      ).map((action) => ["action", action]),
    ])
  const auditLog = useSWRWithOptionalAuth<ActivityLogActionResponse>(
    searchParams ? `/v2/audit-log?${searchParams}` : null
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
