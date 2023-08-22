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
  titleRightElement?: JSX.Element
} & Omit<ButtonProps, "isDisabled">

const ConnectAccount = ({
  account,
  isConnected,
  children,
  isReconnect,
  titleRightElement,
  ...rest
}: PropsWithChildren<Props>) => (
  <JoinStep
    isDone={!isReconnect && !!isConnected}
    title={
      isReconnect
        ? `Reconnect ${account}`
        : isConnected
        ? `${account} connected`
        : `Connect ${account}`
    }
    titleRightElement={titleRightElement}
    buttonLabel={isReconnect ? "Reconnect" : isConnected || "Connect"}
    {...rest}
  >
    {children}
  </JoinStep>
)

export default ConnectAccount
