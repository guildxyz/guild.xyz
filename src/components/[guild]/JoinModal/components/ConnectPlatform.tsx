import { Icon } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useAccess from "components/[guild]/hooks/useAccess"
import usePlatformsToReconnect from "components/[guild]/hooks/usePlatformsToReconnect"
import useUser from "components/[guild]/hooks/useUser"
import Script from "next/script"
import platforms from "platforms/platforms"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { PlatformName } from "types"
import useConnectPlatform from "../hooks/useConnectPlatform"
import ConnectAccount from "./ConnectAccount"

type Props = {
  platform: PlatformName
}

const ConnectPlatform = ({ platform }: Props) => {
  const { isActive } = useWeb3React()
  const { platformUsers, isLoading: isLoadingUser } = useUser()

  const platformsToReconnect = usePlatformsToReconnect()
  const isReconnect = platformsToReconnect.includes(platform)

  // we have the reconnect data from the /access endoint, so we have to mutate that on reconnect success
  const { mutate: mutateAccess } = useAccess()
  const onSuccess = () => isReconnect && mutateAccess()

  const { onConnect, isLoading, loadingText, authData, response } =
    useConnectPlatform(platform, onSuccess, isReconnect)

  const platformFromDb = platformUsers?.find(
    (platformAccount) => platformAccount.platformName === platform
  )

  const { setValue } = useFormContext()

  useEffect(() => {
    if (!isActive && authData) setValue(`platforms.${platform}`, { authData })
  }, [isActive, authData])

  useEffect(() => {
    if (platformFromDb?.platformUserId) setValue(`platforms.${platform}`, null)
  }, [platformFromDb])

  return (
    <ConnectAccount
      account={platforms[platform].name}
      icon={<Icon as={platforms[platform].icon} />}
      colorScheme={platforms[platform].colorScheme as string}
      isConnected={
        (platformFromDb?.platformUserData?.username ??
          platformFromDb?.platformUserId) ||
        response?.platformUserId ||
        (authData && "hidden")
      }
      isReconnect={isReconnect}
      isLoading={isLoading || (!platformUsers && isLoadingUser)}
      onClick={onConnect}
      {...{ loadingText }}
      isDisabled={platform === "TWITTER" && !isActive && "Connect wallet first"}
    >
      {platform === "TELEGRAM" && (
        <Script
          strategy="lazyOnload"
          src="https://telegram.org/js/telegram-widget.js?19"
        />
      )}
    </ConnectAccount>
  )
}

export default ConnectPlatform
