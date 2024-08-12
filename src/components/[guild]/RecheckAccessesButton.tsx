import {
  ButtonProps,
  Divider,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react"
import { ArrowsClockwise, Check } from "@phosphor-icons/react"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useEffect, useMemo, useState } from "react"
import GetRewardsJoinStep from "./JoinModal/components/progress/GetRewardsJoinStep"
import GetRolesJoinStep from "./JoinModal/components/progress/GetRolesJoinStep"
import SatisfyRequirementsJoinStep from "./JoinModal/components/progress/SatisfyRequirementsJoinStep"
import useMembershipUpdate from "./JoinModal/hooks/useMembershipUpdate"

const TIMEOUT = 60_000

type Props = {
  tooltipLabel?: string
  roleId?: number
} & ButtonProps

const POPOVER_HEADER_STYLES = {
  fontWeight: "medium",
  border: 0,
  fontSize: "sm",
  py: "1.5",
  px: "3",
}

const latestResendDateAtom = atomWithStorage("latestResendDate", 0)

const RecheckAccessesButton = ({
  tooltipLabel: tooltipLabelInitial,
  roleId,
  ...rest
}: Props): JSX.Element => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
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
        status: "success",
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
      showErrorToast(
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
    <Popover trigger="hover" placement="bottom" isLazy>
      <PopoverTrigger>
        <IconButton
          aria-label="Re-check accesses"
          icon={
            isFinished ? (
              <Check />
            ) : (
              <Icon
                as={ArrowsClockwise}
                animation={shouldBeLoading ? "rotate 1s infinite linear" : undefined}
              />
            )
          }
          // artificial disabled state, so the popover still works
          {...(isDisabled
            ? {
                opacity: 0.5,
                cursor: "default",
                _hover: { bg: undefined },
                _focus: { bg: undefined },
                _active: { bg: undefined },
              }
            : {
                onClick: () =>
                  triggerMembershipUpdate(roleId && { roleIds: [roleId] }),
              })}
          {...rest}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          {...(!shouldBeLoading ? { minW: "max-content", w: "unset" } : {})}
        >
          <PopoverArrow />
          {isFinished ? (
            <PopoverHeader {...POPOVER_HEADER_STYLES}>
              {`Successfully updated ${roleId ? "access" : "accesses"}`}
            </PopoverHeader>
          ) : isLoading ? (
            shouldBeLoading ? (
              <PopoverBody pb={3} px={4}>
                <VStack
                  spacing={2.5}
                  alignItems={"flex-start"}
                  divider={<Divider />}
                >
                  <SatisfyRequirementsJoinStep joinState={joinProgress} />
                  {!currentlyCheckedRoleIds?.length && (
                    <GetRolesJoinStep joinState={joinProgress} />
                  )}
                  <GetRewardsJoinStep joinState={joinProgress} />
                </VStack>
              </PopoverBody>
            ) : (
              <PopoverHeader {...POPOVER_HEADER_STYLES}>
                {`Checking ${
                  roleId ? "another role" : "a specific role"
                } is in progress`}
              </PopoverHeader>
            )
          ) : canResend ? (
            <PopoverHeader {...POPOVER_HEADER_STYLES}>{tooltipLabel}</PopoverHeader>
          ) : (
            <PopoverHeader {...POPOVER_HEADER_STYLES}>
              {tooltipLabel}
              <Text
                colorScheme="gray"
                w="full"
                fontSize="sm"
                fontWeight={"medium"}
                mt="1"
              >
                Only usable once per minute.
                <br />
                Last checked at: {lastCheckedAt.toLocaleTimeString()}
              </Text>
            </PopoverHeader>
          )}
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

const TopRecheckAccessesButton = (props: ButtonProps) => (
  <RecheckAccessesButton
    tooltipLabel="Re-check accesses & send rewards"
    {...props}
  />
)

export default RecheckAccessesButton
export { TopRecheckAccessesButton }
