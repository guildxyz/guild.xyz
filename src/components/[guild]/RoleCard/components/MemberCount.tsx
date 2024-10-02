import { Badge, BadgeProps } from "@/components/ui/Badge"
import { ProgressIndicator, ProgressRoot } from "@/components/ui/Progress"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { CircleNotch, Users } from "@phosphor-icons/react/dist/ssr"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useUser from "components/[guild]/hooks/useUser"
import useActiveStatusUpdates from "hooks/useActiveStatusUpdates"
import { PropsWithChildren } from "react"
import {
  MemberCountLastSyncTooltip,
  SyncRoleButton,
} from "./MemberCountLastSyncTooltip"

type Props = {
  memberCount: number
  size?: "sm" | "md"
} & BadgeProps

const MemberCount = ({
  memberCount,
  size = "md",
  children,
  className,
  ...badgeProps
}: PropsWithChildren<Props>) => {
  return (
    <Badge className={cn("group mt-1 shrink-0", className)} {...badgeProps}>
      <Users weight="bold" />
      <span>
        {new Intl.NumberFormat("en", { notation: "compact" }).format(
          memberCount ?? 0
        )}
      </span>
      {children}
    </Badge>
  )
}

type WithSyncProps = Props & {
  roleId?: number
}

const MemberCountWithSyncIndicator = ({
  roleId,
  ...rest
}: PropsWithChildren<WithSyncProps>) => {
  const { status, data } = useActiveStatusUpdates(roleId)

  if (status === "STARTED")
    return (
      <Tooltip>
        <TooltipTrigger>
          <MemberCount {...rest}>
            <CircleNotch weight="bold" className="animate-spin" />
          </MemberCount>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent variant="popover" side="bottom" className="text-left">
            <div className="mb-1 font-semibold">Syncing members</div>
            <div>
              <p>
                Updating all member accesses. This can take a few hours, feel free to
                come back later!
              </p>
              <StatusProgress data={data} status={status} />
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    )

  return <MemberCount {...rest} />
}

const StatusProgress = ({
  data,
  status,
}: Pick<ReturnType<typeof useActiveStatusUpdates>, "data" | "status">) => {
  const percentage = !!data ? data.doneChunks / data.totalChunks : 0

  return (
    <div className="mt-3 mb-1 flex items-center gap-1">
      <ProgressRoot>
        <ProgressIndicator value={status === null ? 1 : percentage || 0.01} />
      </ProgressRoot>
      <span className="shrink-0 font-bold text-muted-foreground text-sm">
        {percentage.toFixed(0)}%
      </span>
    </div>
  )
}

const RoleCardMemberCount = ({
  memberCount,
  roleId,
  lastSyncedAt,
}: PropsWithChildren<WithSyncProps & { lastSyncedAt: string }>) => {
  const { featureFlags } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { isSuperAdmin } = useUser()

  return (
    <MemberCountWithSyncIndicator
      memberCount={memberCount}
      roleId={roleId}
      className="!bg-transparent text-muted-foreground"
    >
      {isSuperAdmin ? (
        <MemberCountLastSyncTooltip lastSyncedAt={lastSyncedAt}>
          <div className="mt-2 flex justify-end">
            <SyncRoleButton roleId={roleId} />
          </div>
        </MemberCountLastSyncTooltip>
      ) : isAdmin &&
        featureFlags?.includes("PERIODIC_SYNC") &&
        /* temporarily only showing for superAdmins when lastSyncedAt is null, until we know what to communicate to admins in this case */
        lastSyncedAt ? (
        <MemberCountLastSyncTooltip lastSyncedAt={lastSyncedAt} />
      ) : null}
    </MemberCountWithSyncIndicator>
  )
}

export { MemberCount, MemberCountWithSyncIndicator, RoleCardMemberCount }
