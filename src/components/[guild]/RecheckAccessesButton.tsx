import { IconButton, IconButtonProps } from "@/components/ui/IconButton"
import { Separator } from "@/components/ui/Separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import { useToast } from "@/components/ui/hooks/useToast"
import { cn } from "@/lib/utils"
import { ArrowsClockwise, Check } from "@phosphor-icons/react/dist/ssr"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useEffect, useMemo, useState } from "react"
import { GetRewardsJoinStep } from "./JoinModal/components/progress/GetRewardsJoinStep"
import { GetRolesJoinStep } from "./JoinModal/components/progress/GetRolesJoinStep"
import { SatisfyRequirementsJoinStep } from "./JoinModal/components/progress/SatisfyRequirementsJoinStep"
import { useMembershipUpdate } from "./JoinModal/hooks/useMembershipUpdate"

const TIMEOUT = 60_000

type Props = {
  tooltipLabel?: string
  roleId?: number
} & Omit<IconButtonProps, "aria-label" | "icon">

const latestResendDateAtom = atomWithStorage("latestResendDate", 0)

const RecheckAccessesButton = ({
  tooltipLabel: tooltipLabelInitial,
  roleId,
  ...rest
}: Props): JSX.Element => {
  const { toast } = useToast()
  const errorToast = useErrorToast()
  const [isFinished, setIsFinished] = useState(false)

  const { reqAccesses } = useRoleMembership(roleId)
  const [latestAllResendDate, setLatestAllResendDate] = useAtom(latestResendDateAtom)

  const lastCheckedAt = useMemo(
    () => new Date(reqAccesses?.[0]?.lastCheckedAt ?? latestAllResendDate),
    [reqAccesses, latestAllResendDate]
  )

  const [dateNow, setDateNow] = useState(Date.now())
  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [lastCheckedAt])

  const canResend = dateNow - lastCheckedAt.getTime() > TIMEOUT

  const tooltipLabel =
    tooltipLabelInitial ||
    (roleId ? "Re-check role access" : "Re-check all accesses")

  const {
    triggerMembershipUpdate,
    isLoading,
    joinProgress,
    currentlyCheckedRoleIds,
  } = useMembershipUpdate({
    onSuccess: () => {
      toast({
        variant: "success",
        title: `Successfully updated ${roleId ? "role access" : "accesses"}`,
      })
      setIsFinished(true)

      setTimeout(() => {
        setIsFinished(false)
      }, 3000)
      if (!roleId) setLatestAllResendDate(Date.now())
    },
    onError: (error) => {
      const errorMsg = "Couldn't update accesses"
      const correlationId = error.correlationId
      errorToast(
        correlationId
          ? {
              error: errorMsg,
              correlationId,
            }
          : errorMsg
      )
    },
  })

  const shouldBeLoading = useMemo(() => {
    if (!currentlyCheckedRoleIds) return isLoading

    if (roleId && currentlyCheckedRoleIds?.length)
      return currentlyCheckedRoleIds.includes(roleId) && isLoading

    return false
  }, [isLoading, currentlyCheckedRoleIds, roleId])

  const isDisabled = isLoading || !!isFinished || !canResend

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn({
          "cursor-default": isDisabled,
        })}
      >
        <IconButton
          {...rest}
          aria-label="Re-check accesses"
          icon={
            isFinished ? (
              <Check weight="bold" />
            ) : (
              <ArrowsClockwise
                weight="bold"
                className={cn({
                  "animate-spin": shouldBeLoading,
                })}
              />
            )
          }
          disabled={isDisabled}
          onClick={() => triggerMembershipUpdate(roleId && { roleIds: [roleId] })}
        />
      </TooltipTrigger>
      <TooltipContent variant="popover" className="text-left">
        {isFinished ? (
          <p className="font-medium">{`Successfully updated ${roleId ? "access" : "accesses"}`}</p>
        ) : isLoading ? (
          shouldBeLoading ? (
            <div className="flex flex-col gap-1.5 px-1.5">
              <SatisfyRequirementsJoinStep joinState={joinProgress} />
              <Separator />
              {!currentlyCheckedRoleIds?.length && (
                <>
                  <GetRolesJoinStep joinState={joinProgress} />
                  <Separator />
                </>
              )}
              <GetRewardsJoinStep joinState={joinProgress} />
            </div>
          ) : (
            <p className="font-medium">
              {`Checking ${
                roleId ? "another role" : "a specific role"
              } is in progress`}
            </p>
          )
        ) : canResend ? (
          <p className="font-medium">{tooltipLabel}</p>
        ) : (
          <>
            <p className="font-medium">{tooltipLabel}</p>
            <p className="mt-1 font-medium text-muted-foreground">
              Only usable once per minute.
              <br />
              Last checked at: {lastCheckedAt.toLocaleTimeString()}
            </p>
          </>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

const TopRecheckAccessesButton = (
  props: Omit<IconButtonProps, "aria-label" | "icon">
) => (
  <RecheckAccessesButton
    tooltipLabel="Re-check accesses & send rewards"
    {...props}
  />
)

export default RecheckAccessesButton
export { TopRecheckAccessesButton }
