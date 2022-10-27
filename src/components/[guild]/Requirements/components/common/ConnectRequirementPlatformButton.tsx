import { Icon } from "@chakra-ui/react"
import Button from "components/common/Button"
import useAccess from "components/[guild]/hooks/useAccess"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { reconnectionErrorMessages } from "components/[guild]/RoleCard/components/AccessIndicator/AccessIndicator"
import useToast from "hooks/useToast"
import platforms from "platforms"
import { PlatformName } from "types"

type Props = {
  platform: PlatformName
  roleId?: number
}

const ConnectRequirementPlatformButton = ({ platform, roleId }: Props) => {
  const { platformUsers } = useUser()

  const { mutate: mutateAccesses, data, error } = useAccess()
  const accesses = data || error
  const toast = useToast()
  const onSuccess = () => {
    mutateAccesses()
    toast({
      title: `Successfully connected ${platforms[platform].name}`,
      description: `Your access is being re-checked...`,
      status: "success",
    })
  }

  const roleAccess = accesses?.find?.((access) => access.roleId === roleId)

  const isReconnection = roleAccess?.errors?.some((err) =>
    reconnectionErrorMessages.has(err.msg)
  )

  const { onConnect, isLoading, loadingText, response } = useConnectPlatform(
    platform,
    onSuccess,
    isReconnection
  )

  const platformFromDb = platformUsers?.some(
    (platformAccount) => platformAccount.platformName === platform
  )

  if (!isReconnection && (!platformUsers || platformFromDb || response)) return null

  return (
    <Button
      size="xs"
      onClick={onConnect}
      isLoading={isLoading}
      loadingText={loadingText}
      colorScheme={platform}
      leftIcon={<Icon as={platforms[platform].icon} />}
      iconSpacing="1"
    >
      {`${isReconnection ? "Reconnect" : "Connect"} ${platforms[platform].name}`}
    </Button>
  )
}

export default ConnectRequirementPlatformButton
