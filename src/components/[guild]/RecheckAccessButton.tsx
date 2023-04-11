import { IconButton, Tooltip } from "@chakra-ui/react"
import useLocalStorage from "hooks/useLocalStorage"
import { ArrowsClockwise } from "phosphor-react"
import { useEffect, useState } from "react"
import useJoin from "./JoinModal/hooks/useJoin"

const TIMEOUT = 60_000

const RecheckAccessButton = (): JSX.Element => {
  const [latestRecheckDate, setLatestRecheckDate] = useLocalStorage(
    "latestRecheckDate",
    -Infinity
  )
  const [dateNow, setDateNow] = useState(Date.now())
  const canRecheck = dateNow - latestRecheckDate > TIMEOUT

  const { onSubmit, isLoading } = useJoin(() => setLatestRecheckDate(Date.now()))

  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [])

  return (
    <Tooltip
      label={canRecheck ? "Re-check access" : "You can check access once per minute"}
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
        aria-label="Re-check access"
        icon={<ArrowsClockwise />}
        minW="44px"
        variant="ghost"
        rounded="full"
        onClick={canRecheck ? onSubmit : undefined}
        animation={isLoading ? "rotate 1s infinite linear" : undefined}
        isDisabled={isLoading || !canRecheck}
      />
    </Tooltip>
  )
}

export default RecheckAccessButton
