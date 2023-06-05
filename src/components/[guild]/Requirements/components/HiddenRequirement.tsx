import { Icon, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import useKeyPair from "hooks/useKeyPair"
import { Info, Link, Question } from "phosphor-react"
import platforms from "platforms/platforms"
import { useEffect, useState } from "react"
import Requirement from "./Requirement"

const HiddenRequirement = () => {
  const { account } = useWeb3React()
  const { platformUsers } = useUser()
  const { isValid } = useKeyPair()
  const [hasClicked, setHasClicked] = useState<boolean>(false)
  const { openAccountModal, openWalletSelectorModal } = useWeb3ConnectionManager()

  const canConnectMorePlatforms = Object.keys(platforms).some(
    (platform) =>
      platform !== "POAP" &&
      (platformUsers ?? []).every(
        (platformUser) => platformUser.platformName !== platform
      )
  )

  useEffect(() => {
    if (hasClicked && isValid) {
      openAccountModal()
      setHasClicked(false)
    }
  }, [hasClicked, isValid])

  return (
    <Requirement
      image={<Icon as={Question} boxSize={5} />}
      footer={
        canConnectMorePlatforms ? (
          <Button
            size="xs"
            onClick={
              account
                ? openAccountModal
                : () => {
                    setHasClicked(true)
                    openWalletSelectorModal()
                  }
            }
            colorScheme="primary"
            leftIcon={<Icon as={Link} />}
            iconSpacing="1"
          >
            Connect social accounts
          </Button>
        ) : null
      }
      rightElement={
        <Tooltip label="By connecting more social accounts, you increase your chances for satisfying the hidden requirement(s)">
          <Info />
        </Tooltip>
      }
    >
      Some secret requirements
    </Requirement>
  )
}

export default HiddenRequirement
