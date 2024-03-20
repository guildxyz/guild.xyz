import { Icon } from "@chakra-ui/react"
import usePlatformsToReconnect from "components/[guild]/hooks/usePlatformsToReconnect"
import useUser from "components/[guild]/hooks/useUser"
import Script from "next/script"
import rewards from "platforms/rewards"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { PlatformName } from "types"
import { useAccount } from "wagmi"
import useConnectPlatform from "../hooks/useConnectPlatform"
import useMembershipUpdate from "../hooks/useMembershipUpdate"
import ConnectAccount from "./ConnectAccount"

type Props = {
  platform: PlatformName
}

const ConnectPlatform = ({ platform }: Props) => {
  const { isConnected } = useAccount()
  const { platformUsers, isLoading: isLoadingUser } = useUser()

  const platformsToReconnect = usePlatformsToReconnect()
  const isReconnect = platformsToReconnect.includes(platform)

  // we have the reconnect data from the membership endoint, so we have to mutate that on reconnect success
  const { triggerMembershipUpdate } = useMembershipUpdate()
  const onSuccess = () => isReconnect && triggerMembershipUpdate()

  const { onConnect, isLoading, loadingText } = useConnectPlatform(
    platform,
    onSuccess,
    isReconnect
  )

  const platformFromDb = platformUsers?.find(
    (platformAccount) => platformAccount.platformName === platform
  )

  const { setValue } = useFormContext()

  useEffect(() => {
    if (platformFromDb?.platformUserId) setValue(`platforms.${platform}`, null)
  }, [platformFromDb])

  const accountName = `${rewards[platform].name}${
    platform === "TWITTER_V1" ? " (v1)" : ""
  }`

  return (
    <ConnectAccount
      account={accountName}
      icon={<Icon as={rewards[platform].icon} />}
      colorScheme={rewards[platform].colorScheme as string}
      isConnected={
        platformFromDb?.platformUserData?.username ?? platformFromDb?.platformUserId
      }
      isReconnect={isReconnect}
      isLoading={isLoading || (!platformUsers && isLoadingUser)}
      onClick={onConnect}
      {...{ loadingText }}
      isDisabled={
        (platform === "TWITTER" ||
          platform === "TWITTER_V1" ||
          platform === "DISCORD") &&
        !isConnected &&
        "Connect wallet first"
      }
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
