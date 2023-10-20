import { IconButton, Tooltip } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useLocalStorage from "hooks/useLocalStorage"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { ArrowsClockwise, Check } from "phosphor-react"
import { useEffect, useState } from "react"
import useGuild from "./hooks/useGuild"
import useJoin from "./JoinModal/hooks/useJoin"
import { useIsTabsStuck } from "./Tabs/Tabs"
import { useThemeContext } from "./ThemeContext"

const TIMEOUT = 60_000

const ResendRewardButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { id, urlName } = useGuild()

  const [latestResendDate, setLatestResendDate] = useLocalStorage(
    "latestResendDate",
    -Infinity
  )
  const [dateNow, setDateNow] = useState(Date.now())
  const canResend = dateNow - latestResendDate > TIMEOUT

  const { onSubmit, isLoading, response } = useJoin(
    () => {
      toast({
        status: "success",
        title: "Successfully sent rewards",
      })
      setLatestResendDate(Date.now())
    },
    (error) => {
      const errorMsg = "Couldn't re-send rewards"
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
    false
  )

  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [])

  const onClick = () => {
    onSubmit({ guildId: id })
    captureEvent("Click: ResendRewardButton", {
      guild: urlName,
    })
  }

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <Tooltip
      label={
        response
          ? "Successfully sent rewards"
          : isLoading
          ? "Sending rewards..."
          : canResend
          ? "Re-check accesses & send rewards"
          : "You can use this function once per minute"
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
    >
      <IconButton
        aria-label="Re-check accesses & send rewards"
        icon={response ? <Check /> : <ArrowsClockwise />}
        minW="44px"
        variant="ghost"
        rounded="full"
        onClick={!response && canResend ? onClick : undefined}
        animation={isLoading ? "rotate 1s infinite linear" : undefined}
        isDisabled={isLoading || !!response || !canResend}
        {...(!isStuck && {
          color: textColor,
          colorScheme: buttonColorScheme,
        })}
      />
    </Tooltip>
  )
}

export default ResendRewardButton
