import { Icon, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import useKeyPair from "hooks/useKeyPair"
import { Info, Link, Question, Warning } from "phosphor-react"
import platforms from "platforms/platforms"
import { useEffect, useState } from "react"
import REQUIREMENTS from "requirements"
import { Requirement as RequirementType, Rest } from "types"
import DataBlock from "./DataBlock"
import RequiementAccessIndicator from "./RequiementAccessIndicator"
import Requirement from "./Requirement"
import { RequirementProvider } from "./RequirementContext"

type Props = {
  requirement: RequirementType
  rightElement?: JSX.Element
} & Rest

const RequirementDisplayComponent = ({
  requirement,
  rightElement = <RequiementAccessIndicator />,
  ...rest
}: Props) => {
  const { account } = useWeb3React()
  const { platformUsers } = useUser()
  const { isValid } = useKeyPair()
  const [hasClicked, setHasClicked] = useState<boolean>(false)
  const { openAccountModal, openWalletSelectorModal } = useWeb3ConnectionManager()

  useEffect(() => {
    if (hasClicked && isValid) {
      openAccountModal()
      setHasClicked(false)
    }
  }, [hasClicked, isValid])

  if (requirement.isHidden) {
    const canConnectMorePlatforms = Object.keys(platforms).some(
      (platform) =>
        platform !== "POAP" &&
        (platformUsers ?? []).every(
          (platformUser) => platformUser.platformName !== platform
        )
    )

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

  const RequirementComponent = REQUIREMENTS[requirement.type]?.displayComponent

  if (!RequirementComponent)
    return (
      <Requirement image={<Icon as={Warning} boxSize={5} color="orange.300" />}>
        {`Unsupported requirement type: `}
        <DataBlock>{requirement.type}</DataBlock>
      </Requirement>
    )
  return (
    <RequirementProvider requirement={requirement}>
      <RequirementComponent rightElement={rightElement} {...rest} />
    </RequirementProvider>
  )
}

export default RequirementDisplayComponent
