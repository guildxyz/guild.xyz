import useCreateRequirements from "components/[guild]/AddRewardButton/hooks/useCreateRequirements"
import useCreateRolePlatforms from "components/[guild]/AddRewardButton/hooks/useCreateRolePlatforms"
import useMutateAdditionsToRoles from "components/[guild]/AddRewardButton/hooks/useMutateAdditionsToRoles"
import useMutateCreatedRole from "components/[guild]/AddRewardButton/hooks/useMutateCreatedRole"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useCreateRole, {
  RoleToCreate,
} from "components/create-guild/hooks/useCreateRole"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Requirement } from "types"
import { mapRealRequirementIdsToRolePlatforms } from "utils/mapRealRequirementIdToRolePlatform"

export type SubmitData =
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

const useCreateRRR = ({
  onSuccess,
  feedbackConfig = defaultFeedbackConfigRRR,
}: {
  onSuccess?: (res) => void
  feedbackConfig?: FeedbackConfigRRR
}) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { captureEvent } = usePostHogContext()
  const postHogOptions = {
    hook: "useCreateRRR",
  }

  const mutateCreatedRole = useMutateCreatedRole()
  const mutateAdditionsToRoles = useMutateAdditionsToRoles()

  const {
    onSubmit: createRole,
    isSigning,
    signLoadingText,
  } = useCreateRole({
    skipMutate: true,
    feedbackConfig: feedbackConfig.createRole,
  })
  const { createRequirements } = useCreateRequirements({
    feedbackConfig: feedbackConfig.createRequirements,
  })
  const { createRolePlatforms } = useCreateRolePlatforms({
    feedbackConfig: feedbackConfig.createRolePlatforms,
  })
  const triggerConfetti = useJsConfetti()

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

      try {
        createdRole = await createRole(emptyRole)
      } catch (error) {
        showErrorToast("Failed to create role")
        return
      }

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

      if (feedbackConfig.createRRR.showToast.onSuccess) {
        toast({
          title: "Creation successful!",
          status: "success",
        })
      }

      if (feedbackConfig.createRRR.showConfetti) triggerConfetti()

      if (!!createdRole)
        mutateCreatedRole(createdRole, createdRequirements, createdRolePlatforms)
      if (!createdRole)
        mutateAdditionsToRoles(roleIds, createdRequirements, createdRolePlatforms)

      onSuccess?.(res)
    },
    onError: (error) => {
      if (feedbackConfig.createRRR.showToast.onError)
        showErrorToast("An unexpected error happened while saving your changes")
      captureEvent("Failed to create RRR", { ...postHogOptions, error })
      console.error(error)
    },
  })

  const loadingText = signLoadingText || "Saving data"

  return {
    onSubmit: submitWrapper,
    loadingText,
    isLoading: isLoading || isSigning,
  }
}

export type FeedbackConfig = {
  showConfetti: boolean
  showToast: {
    onSuccess: boolean
    onError: boolean
  }
}

type FeedbackConfigRRR = {
  createRole: FeedbackConfig
  createRequirements: FeedbackConfig
  createRolePlatforms: FeedbackConfig
  createRRR: FeedbackConfig
}

export const defaultFeedbackConfigRRR: FeedbackConfigRRR = {
  createRole: {
    showConfetti: false,
    showToast: {
      onSuccess: false,
      onError: true,
    },
  },
  createRequirements: {
    showConfetti: false,
    showToast: {
      onSuccess: false,
      onError: true,
    },
  },
  createRolePlatforms: {
    showConfetti: false,
    showToast: {
      onSuccess: false,
      onError: true,
    },
  },
  createRRR: {
    showConfetti: true,
    showToast: {
      onSuccess: true,
      onError: true,
    },
  },
}

export default useCreateRRR
