import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useAccess from "components/[guild]/RolesByPlatform/hooks/useAccess"
import { Check, LockSimple, Warning, X } from "phosphor-react"
import { PlatformName } from "types"
import AccessIndicatorUI from "./components/AccessIndicatorUI"

type Props = {
  roleId: number
}

const platformRequirementPrefxes: Partial<Record<PlatformName, string>> = {
  TWITTER: "Twitter",
  GITHUB: "GitHub",
}

const AccessIndicator = ({ roleId }: Props): JSX.Element => {
  const { isActive } = useWeb3React()
  const { hasAccess, error, isLoading } = useAccess(roleId)
  const { roles } = useGuild()
  const role = roles?.find(({ id }) => id === roleId)

  if (!isActive)
    return (
      <AccessIndicatorUI
        label="Join Guild to check access"
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

  const roleError = error?.find((err) => err.roleId === roleId)

  const rolePlatformRequirementIds = new Set(
    role?.requirements
      ?.filter(({ type }) =>
        Object.keys(platformRequirementPrefxes).some((platformName) =>
          type.startsWith(platformName)
        )
      )
      ?.map(({ id }) => id) ?? []
  )

  if (
    Array.isArray(error) &&
    roleError?.errors?.every((err) =>
      rolePlatformRequirementIds.has(err.requirementId)
    )
  ) {
    return (
      <AccessIndicatorUI
        colorScheme="blue"
        label={"Connect below to check access"}
        icon={LockSimple}
      />
    )
  }

  if (Array.isArray(error) && roleError?.errors)
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
