import { ButtonProps, Icon, IconButton, Tooltip } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { ArrowsClockwise, Check } from "phosphor-react"
import { useEffect, useState } from "react"
import useMembershipUpdate from "./JoinModal/hooks/useMembershipUpdate"
import { useIsTabsStuck } from "./Tabs/Tabs"
import { useThemeContext } from "./ThemeContext"
import useGuild from "./hooks/useGuild"

const TIMEOUT = 60_000

type Props = {
  tooltipLabel?: string
  roleIds?: number[]
} & ButtonProps

const latestResendDateAtom = atomWithStorage("latestResendDate", -Infinity)

const RecheckAccessesButton = ({
  tooltipLabel = "Re-check accesses",
  roleIds,
  ...rest
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { urlName } = useGuild()

  const [latestResendDate, setLatestResendDate] = useAtom(latestResendDateAtom)
  const [dateNow, setDateNow] = useState(Date.now())
  const canResend = dateNow - latestResendDate > TIMEOUT

  const { triggerMembershipUpdate, isLoading, isFinished } = useMembershipUpdate(
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
    triggerMembershipUpdate({ roleIds })
    captureEvent("Click: ResendRewardButton", {
      guild: urlName,
    })
  }

  return (
    <Tooltip
      label={
        isFinished
          ? "Successfully updated accesses"
          : isLoading
          ? "Checking accesses..."
          : canResend
          ? tooltipLabel
          : "You can only use this function once per minute"
      }
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
      hasArrow
    >
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
        onClick={!isFinished && canResend ? onClick : undefined}
        isDisabled={isLoading || !!isFinished || !canResend}
        {...rest}
      />
    </Tooltip>
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
