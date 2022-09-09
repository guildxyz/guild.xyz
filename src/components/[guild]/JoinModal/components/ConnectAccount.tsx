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
} & Omit<ButtonProps, "isDisabled">

const ConnectAccount = ({
  account,
  isConnected,
  children,
  ...rest
}: PropsWithChildren<Props>) => (
  <JoinStep
    isDone={!!isConnected}
    title={isConnected ? `${account} connected` : `Connect ${account}`}
    buttonLabel={isConnected ? isConnected : "Connect"}
    {...rest}
  >
    {children}
  </JoinStep>
)

export default ConnectAccount
