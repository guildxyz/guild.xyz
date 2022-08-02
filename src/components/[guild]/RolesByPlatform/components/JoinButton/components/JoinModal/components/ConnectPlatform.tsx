import { ButtonProps, Icon } from "@chakra-ui/react"
import platforms from "platforms"
import { PropsWithChildren } from "react"
import { PlatformName } from "types"
import ConnectAccount from "./ConnectAccount"

type Props = {
  platform: PlatformName
  isConnected: string
} & ButtonProps

const ConnectPlatform = ({
  platform,
  isConnected,
  children,
  ...buttonProps
}: PropsWithChildren<Props>) => {
  // const { platformUsers } = useUser()

  // const isConnected = platformUsers.some(
  //   (platformAccount) => platformAccount.platformName === platform
  // )

  return (
    <ConnectAccount
      account={platforms[platform].name}
      icon={<Icon as={platforms[platform].icon} />}
      colorScheme={platforms[platform].colorScheme as string}
      isConnected={isConnected}
      {...buttonProps}
    >
      {children}
    </ConnectAccount>
  )
}

export default ConnectPlatform
