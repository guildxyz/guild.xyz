import { Icon, Tooltip } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import { Info, Link, Question } from "phosphor-react"
import platforms from "platforms/platforms"
import { useMemo } from "react"
import { PlatformName } from "types"
import Requirement from "./Requirement"

const HiddenRequirement = () => {
  const { platformUsers } = useUser()
  const { openAccountModal } = useWeb3ConnectionManager()

  const canConnectMorePlatforms = useMemo(() => {
    if (!platformUsers) return false

    const connectedPlatforms = platformUsers.map(
      (platformUser) => platformUser.platformName
    )

    return Object.keys(platforms).some(
      (platform: PlatformName) =>
        platform !== "POAP" && !connectedPlatforms.includes(platform)
    )
  }, [platformUsers])

  return (
    <Requirement
      image={<Icon as={Question} boxSize={5} />}
      footer={
        canConnectMorePlatforms ? (
          <Button
            size="xs"
            onClick={openAccountModal}
            colorScheme="blue"
            variant="subtle"
            leftIcon={<Icon as={Link} />}
            iconSpacing="1"
          >
            Connect social accounts
          </Button>
        ) : null
      }
      rightElement={
        canConnectMorePlatforms && (
          <Tooltip label="By connecting more social accounts, you increase your chances for satisfying the hidden requirement(s)">
            <Info />
          </Tooltip>
        )
      }
    >
      Some secret requirements
    </Requirement>
  )
}

export default HiddenRequirement
