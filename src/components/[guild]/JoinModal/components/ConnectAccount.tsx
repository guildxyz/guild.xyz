import { ButtonProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import JoinStep from "./JoinStep"

type Props = {
  account: string
  isRequired?: boolean
  icon: JSX.Element
  colorScheme: string
  isConnected: string
} & ButtonProps

const ConnectAccount = ({
  account,
  isConnected,
  children,
  ...rest
}: PropsWithChildren<Props>) => (
  <JoinStep
    isDone={!!isConnected}
    title={isConnected ? `${account} connected` : `Connect ${account}`}
    buttonLabel={
      isConnected
        ? isConnected
        : rest.isDisabled
        ? "Connect wallet first"
        : "Connect"
    }
    {...rest}
  >
    {children}
  </JoinStep>
)

export default ConnectAccount
