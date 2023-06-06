import { ButtonProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import JoinStep from "./JoinStep"

type Props = {
  account: string
  isRequired?: boolean
  icon: JSX.Element
  colorScheme: string
  isConnected: string
  isDisabled?: string
  isReconnect?: boolean
} & Omit<ButtonProps, "isDisabled">

const ConnectAccount = ({
  account,
  isConnected,
  children,
  isReconnect,
  ...rest
}: PropsWithChildren<Props>) => (
  <JoinStep
    isDone={!isReconnect && !!isConnected}
    title={
      isConnected && !isReconnect
        ? `${account} connected`
        : `${isReconnect ? "Reconnect" : "Connect"} ${account}`
    }
    buttonLabel={
      isConnected && !isReconnect
        ? isConnected
        : isReconnect
        ? "Reconnect"
        : "Connect"
    }
    {...rest}
  >
    {children}
  </JoinStep>
)

export default ConnectAccount
