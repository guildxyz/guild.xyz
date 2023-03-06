import { ButtonProps, Icon } from "@chakra-ui/react"
import Button from "components/common/Button"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useToast from "hooks/useToast"
import platforms from "platforms"

const ConnectDiscordButton = (props: ButtonProps) => {
  const platform = "DISCORD"

  const { platformUsers } = useUser()
  const platformFromDb = platformUsers?.some(
    (platformAccount) => platformAccount.platformName === platform
  )

  const toast = useToast()
  const onSuccess = () => {
    toast({
      title: `Successfully connected ${platforms[platform].name}`,
      status: "success",
    })
  }

  const { onConnect, isLoading, loadingText, response } = useConnectPlatform(
    platform,
    onSuccess
  )

  if (!platformUsers || platformFromDb || response) return null

  return (
    <Button
      h="10"
      onClick={onConnect}
      isLoading={isLoading}
      loadingText={loadingText}
      colorScheme={platform}
      leftIcon={<Icon as={platforms[platform].icon} />}
      iconSpacing="1"
      {...props}
    >
      {`Connect`}
    </Button>
  )
}

export default ConnectDiscordButton
