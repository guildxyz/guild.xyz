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
  VStack,
} from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { ArrowsClockwise, Check } from "phosphor-react"
import { useEffect, useMemo, useState } from "react"
import GetRewardsJoinStep from "./JoinModal/components/progress/GetRewardsJoinStep"
import GetRolesJoinStep from "./JoinModal/components/progress/GetRolesJoinStep"
import SatisfyRequirementsJoinStep from "./JoinModal/components/progress/SatisfyRequirementsJoinStep"
import useMembershipUpdate from "./JoinModal/hooks/useMembershipUpdate"
import { useIsTabsStuck } from "./Tabs/Tabs"
import { useThemeContext } from "./ThemeContext"
import useGuild from "./hooks/useGuild"

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

const latestResendDateAtom = atomWithStorage("latestResendDate", -Infinity)

const RecheckAccessesButton = ({
  tooltipLabel: tooltipLabelInitial,
  roleId,
  ...rest
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const [latestResendDate, setLatestResendDate] = useAtom(latestResendDateAtom)
  const [dateNow, setDateNow] = useState(Date.now())
  const [isFinished, setIsFinished] = useState(false)
  const canResend = true /* dateNow - latestResendDate > TIMEOUT */

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
      setLatestResendDate(Date.now())
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

  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [])

  const onClick = () => {
    triggerMembershipUpdate(roleId && { roleIds: [roleId] })
    captureEvent("Click: ResendRewardButton", {
      guild: urlName,
    })
  }

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
                onClick,
              })}
          sx={{
            "@-webkit-keyframes rotate": {
              from: {
                transform: "rotate(0)",
              },
              to: {
                transform: "rotate(360deg)",
              },
            },
            "@keyframes rotate": {
              from: {
                transform: "rotate(0)",
              },
              to: {
                transform: "rotate(360deg)",
              },
            },
          }}
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
              You can only use this function once per minute
            </PopoverHeader>
          )}
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

const TopRecheckAccessesButton = () => {
  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <RecheckAccessesButton
      minW="44px"
      variant="ghost"
      rounded="full"
      tooltipLabel="Re-check accesses & send rewards"
      {...(!isStuck && {
        color: textColor,
        colorScheme: buttonColorScheme,
      })}
    />
  )
}

export default RecheckAccessesButton
export { TopRecheckAccessesButton }
