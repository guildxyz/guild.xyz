import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { RolePlatform } from "types"

const useDynamicRewardUserAmount = (rolePlatform: RolePlatform) => {
  const { reqAccesses, isLoading } = useRoleMembership(rolePlatform.roleId)
  const dynamicAmount = rolePlatform.dynamicAmount

  if (!dynamicAmount || !reqAccesses) return {}

  const rawProvidedUserAmount =
    reqAccesses.find(
      (req) => req.requirementId === dynamicAmount.operation.input[0].requirementId
    )?.amount ?? 0

  const { addition, multiplier } = (dynamicAmount.operation as any).params

  return {
    isLoading,
    rawProvidedUserAmount,
    dynamicUserAmount: rawProvidedUserAmount * multiplier + addition,
  }
}

export default useDynamicRewardUserAmount
