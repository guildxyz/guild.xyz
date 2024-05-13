import { Tooltip } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { ConnectEmailButton } from "components/common/Layout/components/Account/components/AccountModal/components/SocialAccount/EmailAddress"
import { EnvelopeSimple } from "phosphor-react"
import { useAccount } from "wagmi"
import { JoinStepUI } from "./JoinStep"

const ConnectEmailJoinStep = (): JSX.Element => {
  const { isConnected } = useAccount()
  const { emails } = useUser()

  const isDone = emails?.emailAddress && !emails.pending

  return (
    <JoinStepUI isDone={isDone} title="Connect email">
      <Tooltip
        label="Connect wallet first"
        isDisabled={isConnected}
        shouldWrapChildren
      >
        <ConnectEmailButton
          isDisabled={!isConnected || isDone}
          size="md"
          leftIcon={<EnvelopeSimple />}
          flexShrink="0"
          minW="max-content"
          maxW={isDone && "40"}
        />
      </Tooltip>
    </JoinStepUI>
  )
}

export default ConnectEmailJoinStep
