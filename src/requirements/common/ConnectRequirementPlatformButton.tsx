import { ButtonProps, Icon } from "@chakra-ui/react"
import Button from "components/common/Button"
import useAccess from "components/[guild]/hooks/useAccess"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useToast from "hooks/useToast"
import platforms from "platforms"
import REQUIREMENTS from "requirements"
import { PlatformName, Requirement } from "types"

type Props = {
  requirement: Requirement
} & ButtonProps

const ConnectRequirementPlatformButton = ({ requirement, ...rest }: Props) => {
  const platform = REQUIREMENTS[requirement.type].types[0] as PlatformName

  const { platformUsers } = useUser()

  const { mutate: mutateAccesses, data: roleAccess } = useAccess(requirement.roleId)
  const toast = useToast()
  const onSuccess = () => {
    mutateAccesses()
    toast({
      title: `Successfully connected ${platforms[platform].name}`,
      description: `Your access is being re-checked...`,
      status: "success",
    })
  }

  const isReconnection = roleAccess?.errors?.some(
    (err) =>
      err.requirementId === requirement.id &&
      err.errorType === "PLATFORM_CONNECT_INVALID"
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
      {...rest}
    >
      {`${isReconnection ? "Reconnect" : "Connect"} ${platforms[platform].name}`}
    </Button>
  )
}

export default ConnectRequirementPlatformButton
