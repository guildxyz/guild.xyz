import { ConnectEmailButton } from "@/components/Account/components/AccountModal/components/EmailAddress"
import { Tooltip } from "@chakra-ui/react"
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
          // TODO
          // leftIcon={<EnvelopeSimple />}
          // flexShrink="0"
          // minW="max-content"
          // maxW={isDone && "40"}
        />
      </Tooltip>
    </JoinStepUI>
  )
}

export default ConnectEmailJoinStep
