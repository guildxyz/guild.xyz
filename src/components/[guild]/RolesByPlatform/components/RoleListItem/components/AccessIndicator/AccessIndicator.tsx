import { Icon, Spinner, useColorModeValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useAccess from "components/[guild]/RolesByPlatform/hooks/useAccess"
import { Check, LockSimple, Warning, X } from "phosphor-react"
import AccessIndicatorUI from "./components/AccessIndicatorUI"
import CenterIcon from "./components/CenterIcon"

type Props = {
  roleId: number
}

const AccessIndicator = ({ roleId }: Props): JSX.Element => {
  const { active } = useWeb3React()
  const { hasAccess, error, isLoading } = useAccess([roleId])
  const gray = useColorModeValue("gray", "gray.400")

  if (!active)
    return (
      <AccessIndicatorUI
        label="Connect wallet to check access"
        icon={<Icon as={LockSimple} color={gray} />}
      />
    )

  if (hasAccess)
    return (
      <AccessIndicatorUI
        label="You have access"
        icon={<CenterIcon icon={Check} colorScheme={`green`} />}
      />
    )

  if (isLoading)
    return (
      <AccessIndicatorUI
        label="Checking access"
        icon={<Spinner boxSize={4} color={gray} />}
      />
    )

  if (Array.isArray(error) && error?.find((err) => err.roleId === roleId)?.errors)
    return (
      <AccessIndicatorUI
        label="Couldn’t check access"
        icon={<Icon as={Warning} size={6} color={`orange.500`} />}
      />
    )

  return <AccessIndicatorUI label="No access" icon={<CenterIcon icon={X} />} />
}

export default AccessIndicator
