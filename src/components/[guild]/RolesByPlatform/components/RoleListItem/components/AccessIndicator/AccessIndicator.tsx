import { useWeb3React } from "@web3-react/core"
import useAccess from "components/[guild]/RolesByPlatform/hooks/useAccess"
import { Check, LockSimple, Warning, X } from "phosphor-react"
import AccessIndicatorUI from "./components/AccessIndicatorUI"

type Props = {
  roleId: number
}

const AccessIndicator = ({ roleId }: Props): JSX.Element => {
  const { isActive } = useWeb3React()
  const { hasAccess, error, isLoading } = useAccess([roleId])

  if (!isActive)
    return (
      <AccessIndicatorUI
        label="Connect wallet"
        colorScheme="gray"
        icon={LockSimple}
      />
    )

  if (hasAccess)
    return (
      <AccessIndicatorUI colorScheme="green" label="You have access" icon={Check} />
    )

  if (isLoading)
    return <AccessIndicatorUI colorScheme="gray" label="Checking access" isLoading />

  if (Array.isArray(error) && error?.find((err) => err.roleId === roleId)?.errors)
    return (
      <AccessIndicatorUI
        colorScheme="orange"
        label="Couldn’t check access"
        icon={Warning}
      />
    )

  return <AccessIndicatorUI colorScheme="gray" label="No access" icon={X} />
}

export default AccessIndicator
