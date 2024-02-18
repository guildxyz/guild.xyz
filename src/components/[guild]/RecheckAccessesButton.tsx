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
  VStack,
} from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { ArrowsClockwise, Check } from "phosphor-react"
import { useEffect, useState } from "react"
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
  tooltipLabel = "Re-check accesses",
  ...rest
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { urlName } = useGuild()

  const [latestResendDate, setLatestResendDate] = useAtom(latestResendDateAtom)
  const [dateNow, setDateNow] = useState(Date.now())
  const canResend = dateNow - latestResendDate > TIMEOUT

  const { triggerMembershipUpdate, isLoading, isFinished, joinProgress } =
    useMembershipUpdate(
      () => {
        toast({
          status: "success",
          title: "Successfully updated accesses",
        })
        setLatestResendDate(Date.now())
      },
      (error) => {
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
      }
    )

  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [])

  const onClick = () => {
    triggerMembershipUpdate()
    captureEvent("Click: ResendRewardButton", {
      guild: urlName,
    })
  }

  const isDisabled = isLoading || !!isFinished || !canResend

  return (
    <Popover trigger="hover" placement="bottom" strategy="fixed" isLazy>
      <PopoverTrigger>
        <IconButton
          aria-label="Re-check accesses"
          icon={
            isFinished ? (
              <Check />
            ) : (
              <Icon
                as={ArrowsClockwise}
                animation={isLoading ? "rotate 1s infinite linear" : undefined}
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
      <PopoverContent {...(!isLoading ? { minW: "max-content", w: "unset" } : {})}>
        <PopoverArrow />
        {isFinished ? (
          <PopoverHeader {...POPOVER_HEADER_STYLES}>
            Successfully updated accesses
          </PopoverHeader>
        ) : isLoading ? (
          <PopoverBody pb={3} px={4}>
            <VStack spacing={2.5} alignItems={"flex-start"} divider={<Divider />}>
              <SatisfyRequirementsJoinStep joinState={joinProgress} />

              <GetRolesJoinStep joinState={joinProgress} />

              <GetRewardsJoinStep joinState={joinProgress} />
            </VStack>
          </PopoverBody>
        ) : canResend ? (
          <PopoverHeader {...POPOVER_HEADER_STYLES}>{tooltipLabel}</PopoverHeader>
        ) : (
          <PopoverHeader {...POPOVER_HEADER_STYLES}>
            You can only use this function once per minute
          </PopoverHeader>
        )}
      </PopoverContent>
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
