import { IconButton, Tooltip } from "@chakra-ui/react"
import useLocalStorage from "hooks/useLocalStorage"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { ArrowsClockwise, Check } from "phosphor-react"
import { useEffect, useState } from "react"
import fetcher from "utils/fetcher"
import useGuild from "./hooks/useGuild"

const TIMEOUT = 60_000

const rejoin = (signedValidation: SignedValdation) =>
  fetcher(`/user/join`, signedValidation)

const ResendRewardButton = (): JSX.Element => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { id } = useGuild()

  const [latestResendDate, setLatestResendDate] = useLocalStorage(
    "latestResendDate",
    -Infinity
  )
  const [dateNow, setDateNow] = useState(Date.now())
  const canResend = dateNow - latestResendDate > TIMEOUT

  const { onSubmit, isLoading, response } = useSubmitWithSign(rejoin, {
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully sent rewards",
      })
      setLatestResendDate(Date.now())
    },
    onError: () => showErrorToast("Couldn't re-send rewards"),
  })

  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [])

  return (
    <Tooltip
      label={
        response
          ? "Successfully sent rewards"
          : isLoading
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
        icon={response ? <Check /> : <ArrowsClockwise />}
        minW="44px"
        variant="ghost"
        rounded="full"
        onClick={
          !response && canResend ? () => onSubmit({ guildId: id }) : undefined
        }
        animation={isLoading ? "rotate 1s infinite linear" : undefined}
        isDisabled={isLoading || response || !canResend}
      />
    </Tooltip>
  )
}

export default ResendRewardButton
