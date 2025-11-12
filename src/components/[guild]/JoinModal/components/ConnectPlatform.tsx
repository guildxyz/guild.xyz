import { PLATFORM_COLORS } from "@/components/Account/components/AccountModal/components/SocialAccount"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import usePlatformsToReconnect from "components/[guild]/hooks/usePlatformsToReconnect"
import useUser from "components/[guild]/hooks/useUser"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import rewards from "rewards"
import { PlatformName } from "types"
import { useConnectPlatform } from "../hooks/useConnectPlatform"
import { useMembershipUpdate } from "../hooks/useMembershipUpdate"
import { JoinStep } from "./JoinStep"

type Props = {
  platform: PlatformName
}

const ConnectPlatform = ({ platform }: Props) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const { platformUsers, isLoading: isLoadingUser } = useUser()

  const platformsToReconnect = usePlatformsToReconnect()
  const isReconnect = platformsToReconnect.includes(platform)

  // we have the reconnect data from the membership endpoint, so we have to mutate that on reconnect success
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
  }, [platformFromDb, platform, setValue])

  const accountName = `${rewards[platform].name}${
    platform === "TWITTER_V1" ? " (v1)" : ""
  }`

  const isDisabled = !isWeb3Connected
  const isConnected = !!platformFromDb
  const buttonLabel =
    platformFromDb?.platformUserData?.username ?? platformFromDb?.platformUserId

  const Icon = rewards[platform].icon

  return (
    <JoinStep
      isDone={!isReconnect && isConnected}
      title={
        isReconnect
          ? `Reconnect ${accountName}`
          : isConnected
            ? `${accountName} connected`
            : `Connect ${accountName}`
      }
      disabledText="Connect wallet first"
      buttonProps={{
        leftIcon: Icon ? <Icon weight="bold" /> : undefined,
        disabled: isDisabled,
        isLoading: isLoading || (!platformUsers && isLoadingUser),
        loadingText,
        onClick: onConnect,
        className: PLATFORM_COLORS[platform],
        children: isReconnect ? "Reconnect" : isConnected ? buttonLabel : "Connect",
      }}
    />
  )
}

export { ConnectPlatform }
