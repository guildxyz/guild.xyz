import { ButtonProps, Icon } from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import useAccess from "components/[guild]/hooks/useAccess"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import useToast from "hooks/useToast"
import platforms from "platforms/platforms"
import REQUIREMENTS from "requirements"
import { PlatformName } from "types"
import { useRequirementContext } from "./RequirementContext"

export const TWITTER_V1_REQUIREMENTS = new Set<string>([
  "TWITTER_FOLLOW",
  "TWITTER_FOLLOWED_BY",
  "TWITTER_LIST_FOLLOW",
])

const mapTwitterV1 = (
  requirementType: string,
  platformName: PlatformName
): PlatformName => {
  if (TWITTER_V1_REQUIREMENTS.has(requirementType)) {
    return "TWITTER_V1"
  }
  return platformName
}

const ConnectRequirementPlatformButton = (props: ButtonProps) => {
  const { id, roleId, poapId, type } = useRequirementContext()

  const platform = mapTwitterV1(type, REQUIREMENTS[type].types[0] as PlatformName)

  const { platformUsers } = useUser()

  const { mutate: mutateAccesses, data: roleAccess } = useAccess(roleId ?? 0)
  // temporary until POAP is not a real reward
  const { mutate: mutatePoapAccesses, data: poapAccess } =
    useUserPoapEligibility(poapId)

  const toast = useToast()
  const onSuccess = () => {
    mutateAccesses()
    if (poapId) {
      mutatePoapAccesses()
    }
    toast({
      title: `Successfully connected ${platforms[platform].name}`,
      description: `Your access is being re-checked...`,
      status: "success",
    })
  }

  const isReconnection = (roleAccess || poapAccess)?.errors?.some(
    (err) => err.requirementId === id && err.errorType === "PLATFORM_CONNECT_INVALID"
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
      colorScheme={platforms[platform]?.colorScheme}
      leftIcon={<Icon as={platforms[platform]?.icon} />}
      iconSpacing="1"
      {...props}
    >
      {`${isReconnection ? "Reconnect" : "Connect"} ${platforms[platform]?.name}`}
    </Button>
  )
}

export default ConnectRequirementPlatformButton
