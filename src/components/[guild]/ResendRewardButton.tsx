import { IconButton, Tooltip } from "@chakra-ui/react"
import useLocalStorage from "hooks/useLocalStorage"
import { ArrowsClockwise } from "phosphor-react"
import { useEffect, useState } from "react"
import useJoin from "./JoinModal/hooks/useJoin"

const TIMEOUT = 60_000

const ResendRewardButton = (): JSX.Element => {
  const [latestResendDate, setLatestResendDate] = useLocalStorage(
    "latestResendDate",
    -Infinity
  )
  const [dateNow, setDateNow] = useState(Date.now())
  const canResend = dateNow - latestResendDate > TIMEOUT

  const { onSubmit, isLoading } = useJoin(() => setLatestResendDate(Date.now()))

  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [])

  return (
    <Tooltip
      label={
        isLoading
          ? "Sending rewards..."
          : canResend
          ? "Re-send rewards"
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
        aria-label="Re-send rewards"
        icon={<ArrowsClockwise />}
        minW="44px"
        variant="ghost"
        rounded="full"
        onClick={canResend ? onSubmit : undefined}
        animation={isLoading ? "rotate 1s infinite linear" : undefined}
        isDisabled={isLoading || !canResend}
      />
    </Tooltip>
  )
}

export default ResendRewardButton
