import { ConnectEmailButton } from "@/components/Account/components/AccountModal/components/EmailAddress"
import { ConnectFarcasterButton } from "@/components/Account/components/AccountModal/components/FarcasterProfile"
import { PLATFORM_COLORS } from "@/components/Account/components/AccountModal/components/SocialAccount"
import { Button, ButtonProps } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { useToast } from "@chakra-ui/react"
import type { Icon } from "@phosphor-icons/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useUser from "components/[guild]/hooks/useUser"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import REQUIREMENTS from "requirements"
import { RequirementType } from "requirements/types"
import rewards from "rewards"
import { PlatformName } from "types"
import { useRequirementContext } from "./RequirementContext"

function requirementTypeToPlatformName(type: RequirementType): PlatformName {
  if (type === "ALLOWLIST_EMAIL") return "EMAIL"
  if (REQUIREMENTS[type].types[0].startsWith("TWITTER")) return "TWITTER_V1"
  if (REQUIREMENTS[type].types[0].startsWith("WORLD_ID")) return "WORLD_ID"
  return REQUIREMENTS[type].types[0].split("_")[0] as PlatformName
}

const RequirementConnectButton = (props: ButtonProps) => {
  const { platformUsers, emails, farcasterProfiles } = useUser()
  const { type, roleId, id } = useRequirementContext()
  const platform = requirementTypeToPlatformName(type)

  const { reqAccesses } = useRoleMembership(roleId)
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const toast = useToast()

  const isReconnection = reqAccesses?.some(
    (req) => req.requirementId === id && req.errorType === "PLATFORM_CONNECT_INVALID"
  )

  const platformFromDb = platformUsers?.some(
    (platformAccount) => platformAccount.platformName === platform
  )

  if (
    platform === "EMAIL"
      ? !emails?.pending && emails?.emailAddress
      : platform === "FARCASTER"
        ? !farcasterProfiles || !!farcasterProfiles?.[0]
        : !isReconnection && (!platformUsers || platformFromDb)
  )
    return null

  const onSuccess = () => {
    triggerMembershipUpdate()
    toast({
      title: `Successfully connected ${rewards[platform].name}`,
      description: `Your access is being re-checked...`,
      status: "success",
    })
  }

  const ButtonComponent =
    platform === "EMAIL"
      ? ConnectEmailButton
      : platform === "FARCASTER"
        ? ConnectFarcasterButton
        : ConnectRequirementPlatformButton

  return (
    <ButtonComponent
      isReconnection={isReconnection}
      onSuccess={onSuccess}
      size="xs"
      // TODO: find a better solution for handling the icon
      {...(platform === "EMAIL" || platform === "FARCASTER"
        ? undefined
        : { icon: rewards[platform]?.icon })}
      {...props}
    />
  )
}

const ConnectRequirementPlatformButton = ({
  onSuccess,
  isReconnection,
  icon: IconComponent,
  className,
  ...props
}: ButtonProps & {
  onSuccess: () => void
  isReconnection?: boolean
  icon?: Icon
}) => {
  const { type } = useRequirementContext()

  const platform = requirementTypeToPlatformName(type)

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
      className={cn(PLATFORM_COLORS[platform], "text-white", className)}
      {...props}
    >
      {!!IconComponent && <IconComponent />}
      {`${isReconnection ? "Reconnect" : "Connect"} ${
        rewards[platform]?.name === "X" ? "" : rewards[platform]?.name
      }`}
    </Button>
  )
}

export default RequirementConnectButton
