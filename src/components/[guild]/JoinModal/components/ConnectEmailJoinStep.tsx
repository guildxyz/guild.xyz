import { ConnectEmailButton } from "@/components/Account/components/AccountModal/components/EmailAddress"
import { cn } from "@/lib/utils"
import { Tooltip } from "@chakra-ui/react"
import { EnvelopeSimple } from "@phosphor-icons/react/EnvelopeSimple"
import useUser from "components/[guild]/hooks/useUser"
import { useAccount } from "wagmi"
import { JoinStepUI } from "./JoinStep"

const ConnectEmailJoinStep = (): JSX.Element => {
  const { isConnected } = useAccount()
  const { emails } = useUser()

  const isDone = Boolean(emails?.emailAddress && !emails.pending)

  return (
    <JoinStepUI isDone={isDone} title="Connect email">
      <Tooltip
        label="Connect wallet first"
        isDisabled={isConnected}
        shouldWrapChildren
      >
        <ConnectEmailButton
          disabled={!isConnected || isDone}
          size="md"
          className={cn("min-w-max shrink-0", { "max-w-40": isDone })}
          leftIcon={<EnvelopeSimple />}
        />
      </Tooltip>
    </JoinStepUI>
  )
}

export default ConnectEmailJoinStep
