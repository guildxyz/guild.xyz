import { ButtonProps, LinkProps } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useToast from "hooks/useToast"
import platforms from "platforms"
import { GuildPlatform, PlatformName, PlatformType } from "types"

const usePlatformAccessButton = (
  platform: GuildPlatform
): { label: string } & LinkProps & ButtonProps => {
  const { platformUsers } = useUser()
  const platformName: PlatformName = PlatformType[
    platform.platformId
  ] as PlatformName

  const toast = useToast()
  const onSuccess = () =>
    toast({
      title: `Successfully connected ${platforms[platformName].name}`,
      description: `You can now go to ${platforms[platformName].name} and enjoy your access(es)`,
      status: "success",
    })

  const { onConnect, isLoading, loadingText, response } = useConnectPlatform(
    platformName,
    onSuccess
  )

  const platformFromDb = platformUsers?.some(
    (platformAccount) => platformAccount.platformName === platformName
  )

  if (!platformFromDb && !response)
    return {
      label: "Connect to claim access",
      onClick: onConnect,
      isLoading: isLoading,
      loadingText: loadingText,
    }

  if (platform.invite)
    return {
      label: `Go to ${platforms[platformName].gatedEntity}`,
      as: "a",
      target: "_blank",
      href: platform.invite,
    }

  return {
    label: "Couldn't fetch link",
    isDisabled: true,
  }
}

export default usePlatformAccessButton
