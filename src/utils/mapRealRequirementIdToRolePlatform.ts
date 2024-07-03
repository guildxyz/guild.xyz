import { RequirementIdMap } from "hooks/useCreateRRR"
import { RolePlatform } from "types"

type Props = {
  rolePlatform: RolePlatform
  requirementIdMap: RequirementIdMap
  roleId: number
  onMissingId: () => void
}

export const mapRealRequirementIdToRolePlatform = ({
  rolePlatform,
  requirementIdMap,
  roleId,
  onMissingId,
}: Props) => {
  if (!rolePlatform.dynamicAmount) return { ...rolePlatform, roleId: roleId }

  const input: any = rolePlatform.dynamicAmount.operation.input
  const requirementId = requirementIdMap[input.requirementId][roleId]

  if (!requirementId) {
    onMissingId?.()
    return null
  }

  return {
    ...rolePlatform,
    roleId: roleId,
    dynamicAmount: {
      ...rolePlatform.dynamicAmount,
      operation: {
        ...rolePlatform.dynamicAmount.operation,
        input: {
          ...input,
          requirementId,
          roleId,
        },
      },
    },
  }
}

/**
 * During dynamic reward setup, requirements are referenced by a temporary ID
 * (`tempRequirementId`).
 *
 * After the requirements are created, these references need to be updated with the
 * real IDs of the created requirements.
 *
 * This function updates these references according to the `requirementIdMap`, that
 * keeps track of the temporary ID - real ID pairs.
 */
export const mapRealRequirementIdsToRolePlatforms = ({
  roleIds,
  rolePlatforms,
  requirementIdMap,
  onMissingId,
}: {
  roleIds: number[]
  rolePlatforms: RolePlatform[]
  requirementIdMap: RequirementIdMap
  onMissingId?: () => void
}) =>
  roleIds.flatMap((roleId) =>
    rolePlatforms
      .map((rolePlatform) =>
        mapRealRequirementIdToRolePlatform({
          rolePlatform,
          requirementIdMap,
          roleId,
          onMissingId,
        })
      )
      .filter((rp) => rp !== null)
  )
