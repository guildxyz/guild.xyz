import { ButtonProps, Icon } from "@chakra-ui/react"
import Button from "components/common/Button"
import { ConnectEmailButton } from "components/common/Layout/components/Account/components/AccountModal/components/SocialAccount/EmailAddress"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import useAccess from "components/[guild]/hooks/useAccess"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
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

const RequirementConnectButton = (props: ButtonProps) => {
  const { platformUsers, emails } = useUser()
  const { type, roleId, poapId, id } = useRequirementContext()
  const platform = mapTwitterV1(type, REQUIREMENTS[type].types[0] as PlatformName)

  const { mutate: mutateAccesses, data: roleAccess } = useAccess(roleId ?? 0)
  // temporary until POAP is not a real reward
  const { mutate: mutatePoapAccesses, data: poapAccess } =
    useUserPoapEligibility(poapId)
  const toast = useToast()

  const isReconnection = (roleAccess || poapAccess)?.errors?.some(
    (err) => err.requirementId === id && err.errorType === "PLATFORM_CONNECT_INVALID"
  )

  const platformFromDb = platformUsers?.some(
    (platformAccount) => platformAccount.platformName === platform
  )

  if (
    type?.startsWith("EMAIL")
      ? !emails?.pending && emails?.emailAddress
      : !isReconnection && (!platformUsers || platformFromDb)
  )
    return null

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

  const ButtonComponent = type?.startsWith("EMAIL")
    ? ConnectEmailButton
    : ConnectRequirementPlatformButton

  return (
    <ButtonComponent
      isReconnection={isReconnection}
      onSuccess={onSuccess}
      leftIcon={<Icon as={platforms[platform]?.icon} />}
      size="xs"
      iconSpacing="1"
      {...props}
    />
  )
}

const ConnectRequirementPlatformButton = ({
  onSuccess,
  isReconnection,
  ...props
}: ButtonProps & { onSuccess: () => void; isReconnection?: boolean }) => {
  const { type } = useRequirementContext()

  const platform = mapTwitterV1(type, REQUIREMENTS[type].types[0] as PlatformName)

  const { onConnect, isLoading, loadingText } = useConnectPlatform(
    platform,
    onSuccess,
    isReconnection
  )

  return (
    <Button
      onClick={onConnect}
      isLoading={isLoading}
      loadingText={loadingText}
      colorScheme={platforms[platform]?.colorScheme}
      {...props}
    >
      {`${isReconnection ? "Reconnect" : "Connect"} ${platforms[platform]?.name}`}
    </Button>
  )
}

export default RequirementConnectButton
