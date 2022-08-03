import { Icon } from "@chakra-ui/react"
import Button from "components/common/Button"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useConnectPlatform"
import useAccess from "components/[guild]/RolesByPlatform/hooks/useAccess"
import platforms from "platforms"
import { PlatformName } from "types"

type Props = {
  platform: PlatformName
}

const ConnectRequirementPlatformButton = ({ platform }: Props) => {
  const { mutate: mutateAccesses } = useAccess()
  const { platformUsers } = useUser()
  const { onConnect, isLoading, loadingText, response } = useConnectPlatform(
    platform,
    mutateAccesses
  )

  const platformFromDb = platformUsers?.some(
    (platformAccount) => platformAccount.platformName === platform
  )

  if (!platformUsers || platformFromDb || response) return null

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
      {`Connect ${platforms[platform].name}`}
    </Button>
  )
}

export default ConnectRequirementPlatformButton
