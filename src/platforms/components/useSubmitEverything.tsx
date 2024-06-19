import useCreateRequirements from "components/[guild]/AddRewardButton/hooks/useCreateRequirements"
import useCreateRolePlatforms from "components/[guild]/AddRewardButton/hooks/useCreateRolePlatforms"
import useCreateRole, {
  RoleToCreate,
} from "components/create-guild/hooks/useCreateRole"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Requirement } from "types"
import { mapRealRequirementIdsToRolePlatforms } from "utils/mapRealRequirementIdToRolePlatform"

type SubmitData =
  /**
   * If RoleToCreate is provided and `roleIds` is empty, a new role will be created
   * with the associated rolePlatforms and requirements.
   */
  Partial<RoleToCreate> & {
    /**
     * Array of role IDs. If provided, rolePlatforms and requirements will be added
     * to all specified roles. If not provided, RoleToCreate will be used to create a
     * new role and associate them with it.
     */
    roleIds?: number[]

    /**
     * Array of requirements. If referenced in a rolePlatform, the requirement should
     * have a temporal `id` generated with Date.now() A requirementIdMap will be
     * created to match each temporalId-roleId pair with the actual backend-created
     * ID after creation.
     */
    requirements: RoleToCreate["requirements"]

    /**
     * Array of rolePlatforms. These are created last, and their `roleId` fields will
     * be filled based on the `roleIds` array or the new role ID if a new role was
     * created.
     */
    rolePlatforms: RoleToCreate["rolePlatforms"]
  }

/**
 * A map to keep track of the real requirement IDs after creation.
 *
 * During dynamic reward setup, requirements are referenced by a temporary ID
 * (`tempRequirementId`).
 *
 * After the requirements are created, these references need to be updated with the
 * real IDs of the created requirements.
 *
 * On the UI, we provide the option to add a reward (with its referenced
 * requirements) to multiple roles. Because of this, after creation, each requirement
 * will have multiple real IDs, one for each role it was assigned to.
 *
 * This map is structured to support this double indexing:
 *
 * - The outer object is indexed by the temporary requirement ID.
 * - Each entry contains another object where the keys are role IDs.
 * - The values in the innermost object are the real requirement IDs assigned by the
 *   backend.
 */
export type RequirementIdMap = {
  [tempRequirementId: number]: {
    [roleId: number]: number // real requirement ID assigned by the backend
  }
}

const useSubmitEverything = ({
  methods,
  onSuccess,
}: {
  methods: any
  onSuccess: () => void
}) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { onSubmit, isSigning, signLoadingText } = useCreateRole({
    skipMutate: true,
  })

  const createRole = async (role: RoleToCreate) => {
    try {
      return await onSubmit(role)
    } catch (error) {
      showErrorToast("Failed to create role")
      return null
    }
  }

  const { createRequirements } = useCreateRequirements()
  const { createRolePlatforms } = useCreateRolePlatforms()

  const submit = async (data: SubmitData) => {
    const { requirements, rolePlatforms, roleIds: rawRoleIds = [], ...role } = data
    const roleIds = rawRoleIds.map(Number)

    // If no roleIds are set, that means a new role needs to be created
    let createdRole = null
    if (roleIds.length == 0) {
      const emptyRole = {
        ...(role as RoleToCreate),
        requirements: [{ type: "FREE" } as Requirement],
        rolePlatforms: [],
      }
      createdRole = await createRole(emptyRole)
      if (!createdRole) return
      roleIds.push(createdRole.id)
    }

    // Create the requirements, and the tempId - realId mapping (`requirementIdMap`)
    const { createdRequirements, requirementIdMap } = await createRequirements(
      requirements,
      roleIds
    )

    // Update the requirement references according to the requirementIdMap
    const transformedRolePlatforms = mapRealRequirementIdsToRolePlatforms({
      roleIds,
      rolePlatforms,
      requirementIdMap,
      onMissingId: () =>
        showErrorToast(
          `Skipping a reward creation, as its referenced requirement was not successfully created`
        ),
    })

    const createdRolePlatforms = await createRolePlatforms(transformedRolePlatforms)
    return { roleIds, createdRole, createdRequirements, createdRolePlatforms }
  }

  const { onSubmit: submitWrapper, isLoading } = useSubmit(submit, {
    onSuccess: (res) => {
      const { roleIds, createdRole, createdRequirements, createdRolePlatforms } = res

      toast({
        title: "Role successfully created",
        status: "success",
      })

      // TODO: Mutate

      onSuccess?.()
    },
    onError: (error) => {
      showErrorToast("Failed to create role due to an unexpected error")
      console.error(error)
    },
  })

  const loadingText = signLoadingText || "Saving data"

  return {
    onSubmit: () => {
      methods.handleSubmit(submitWrapper)()
    },
    loadingText,
    isLoading: isLoading || isSigning,
  }
}

export default useSubmitEverything
