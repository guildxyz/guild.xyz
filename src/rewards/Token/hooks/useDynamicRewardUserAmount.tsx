import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { RolePlatform } from "types"

const useDynamicRewardUserAmount = (
  rolePlatform: Pick<RolePlatform, "roleId" | "dynamicAmount">
) => {
  const { reqAccesses, isLoading } = useRoleMembership(rolePlatform?.roleId)
  const dynamicAmount: any = rolePlatform?.dynamicAmount

  if (!dynamicAmount || !reqAccesses) return {}

  // When received from the backend, input is an array. When submitting, though, it need a single object
  const linkedRequirementId =
    dynamicAmount.operation.input?.[0]?.requirementId ??
    dynamicAmount.operation.input?.requirementId ??
    null

  const rawProvidedUserAmount =
    reqAccesses.find((req) => req.requirementId === linkedRequirementId)?.amount ?? 0

  const { addition, multiplier } = (dynamicAmount.operation as any).params
  const convertedAmount = rawProvidedUserAmount * multiplier + addition
  const shouldFloor: boolean = dynamicAmount.operation.params.shouldFloorResult
  const finalAmount = shouldFloor ? Math.floor(convertedAmount) : convertedAmount

  return {
    isLoading,
    rawProvidedUserAmount,
    dynamicUserAmount: finalAmount,
  }
}

export default useDynamicRewardUserAmount
