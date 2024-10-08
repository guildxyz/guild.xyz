import { Button } from "@/components/ui/Button"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import { useToast } from "@/components/ui/hooks/useToast"
import { Info, UserSwitch } from "@phosphor-icons/react/dist/ssr"
import useSubmit from "hooks/useSubmit"
import { PropsWithChildren, useMemo } from "react"
import fetcher from "utils/fetcher"
import formatRelativeTimeFromNow, {
  DAY_IN_MS,
  MINUTE_IN_MS,
} from "utils/formatRelativeTimeFromNow"

const HOUR_IN_MS = MINUTE_IN_MS * 60

const MemberCountLastSyncTooltip = ({
  lastSyncedAt,
  children,
}: PropsWithChildren<{ lastSyncedAt: string }>) => {
  const readableDate = useMemo(() => {
    if (!lastSyncedAt) return "unknown"

    const date = new Date(lastSyncedAt)
    const timeDifference = Date.now() - date.getTime()

    const sinceHours = timeDifference / HOUR_IN_MS
    if (sinceHours < 1) return "less than an hour"

    const sinceDays = timeDifference / DAY_IN_MS
    if (sinceDays < 1) return "less than a day"

    const sinceWeeks = timeDifference / (DAY_IN_MS * 7)
    if (sinceWeeks >= 1) return "more than a week"

    return formatRelativeTimeFromNow(timeDifference)
  }, [lastSyncedAt])

  return (
    <Tooltip>
      <TooltipTrigger className="group/trigger">
        <Info
          weight="bold"
          className="opacity-0 transition-opacity group-hover:opacity-100 group-[&:not([data-state=closed])]/trigger:opacity-100"
        />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          variant="popover"
          side="bottom"
          className="min-w-max text-left"
        >
          <p className="font-medium text-sm">{`Last updated all member accesses ${readableDate} ago`}</p>
          {children}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

export const SyncRoleButton = ({ roleId }) => {
  const { toast } = useToast()
  const errorToast = useErrorToast()

  const submit = () =>
    // TODO: use fetcherWithSign (with params in array) when the BE will add auth back
    fetcher("/v2/periodic-sync/roles", { method: "POST", body: { roleId } })

  const { onSubmit, isLoading } = useSubmit(submit, {
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Successfully moved job to the start of the queue",
      })
    },
    onError: (err) => errorToast(err),
  })

  return (
    <Button
      size="sm"
      variant="outline"
      leftIcon={<UserSwitch weight="bold" />}
      onClick={onSubmit}
      isLoading={isLoading}
    >
      Update all member accesses
    </Button>
  )
}

export { MemberCountLastSyncTooltip }
