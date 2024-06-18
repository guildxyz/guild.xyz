import useGuild from "components/[guild]/hooks/useGuild"
import useCreateRole, {
  RoleToCreate,
} from "components/create-guild/hooks/useCreateRole"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Requirement, RolePlatform } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirement from "utils/preprocessRequirement"

type SubmitData =
  /**
   * If RoleToCreate is provided and `roleIds` is empty, a new role will be created
   * with the associated rolePlatforms and requirements.
   */
  Partial<RoleToCreate> & {
    /**
     * Array of role IDs. If provided, rolePlatforms and requirements will be added to
     * all specified roles. If not provided, RoleToCreate will be used to create a new
     * role and associate them with it.
     */
    roleIds?: number[]

    /**
     * Array of requirements. If referenced in a rolePlatform, the requirement should
     * have a temporal `id` generated with Date.now() A requirementIdMap will be
     * created to match each temporalId-roleId pair with the actual backend-created ID
     * after creation.
     */
    requirements: RoleToCreate["requirements"]

    /**
     * Array of rolePlatforms. These are created last, and their `roleId` fields will
     * be filled based on the `roleIds` array or the new role ID if a new role was
     * created.
     */
    rolePlatforms: RoleToCreate["rolePlatforms"]
  }

const useSubmitEverything = ({
  methods,
  onSuccess,
}: {
  methods: any
  onSuccess: () => void
}) => {
  const toast = useToast()
  const fetcherWithSign = useFetcherWithSign()
  const { id: guildId } = useGuild()
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

  const createRequirements = async (
    requirements: Partial<Requirement>[],
    roleIds: number[]
  ) => {
    const requirementIdMap = {}

    const promises = roleIds.flatMap((roleId) =>
      requirements.map((req) =>
        fetcherWithSign([
          `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
          {
            method: "POST",
            body: preprocessRequirement(req),
          },
        ])
          .then((res) => {
            if (!requirementIdMap[req.id]) requirementIdMap[req.id] = {}
            requirementIdMap[req.id][roleId] = res.id
            return { status: "fulfilled", result: res }
          })
          .catch((error) => {
            showErrorToast("Failed to create a requirement")
            console.error(error)
            return { status: "rejected", result: error }
          })
      )
    )

    const results = await Promise.all(promises)
    const createdRequirements = results
      .filter((res) => res.status === "fulfilled")
      .map((res) => res.result)

    return { createdRequirements, requirementIdMap }
  }

  const transformRolePlatform = (
    rp: RolePlatform,
    requirementIdMap: Record<number, Record<number, number>>,
    roleId: number
  ) => {
    if (!rp.dynamicAmount) return { ...rp, roleId: roleId }

    const input: any = rp.dynamicAmount.operation.input
    const requirementId = requirementIdMap[input.requirementId][roleId]

    if (!requirementId) {
      showErrorToast(
        `Skipping a reward creation, as its referenced requirement was not successfully created`
      )
      return null
    }

    return {
      ...rp,
      roleId: roleId,
      dynamicAmount: {
        ...rp.dynamicAmount,
        operation: {
          ...rp.dynamicAmount.operation,
          input: {
            ...input,
            requirementId,
            roleId,
          },
        },
      },
    }
  }

  const createRolePlatforms = async (
    rolePlatforms: RolePlatform[]
  ): Promise<RolePlatform[]> => {
    const promises = rolePlatforms.map((rolePlatform) =>
      fetcherWithSign([
        `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms`,
        { method: "POST", body: rolePlatform },
      ])
        .then((res: RolePlatform) => ({ status: "fulfilled", result: res }))
        .catch((error) => {
          showErrorToast("Failed to create a reward")
          console.error(error)
          return { status: "rejected", result: error }
        })
    )

    const results = await Promise.all(promises)
    return results
      .filter((res) => res.status === "fulfilled")
      .map((res) => res.result)
  }

  const submit = async (data: SubmitData) => {
    const { requirements, rolePlatforms, roleIds: rawRoleIds = [], ...role } = data
    const roleIds = rawRoleIds.map(Number)

    let createdRole = null
    const emptyRole = {
      ...(role as RoleToCreate),
      requirements: [{ type: "FREE" } as Requirement],
      rolePlatforms: [],
    }
    if (roleIds.length == 0) {
      createdRole = await createRole(emptyRole)
      if (!createdRole) return
      roleIds.push(createdRole.id)
    }

    const { createdRequirements, requirementIdMap } = await createRequirements(
      requirements,
      roleIds
    )

    const transformedRolePlatforms = roleIds.flatMap((roleId) =>
      rolePlatforms
        .map((rp) => transformRolePlatform(rp, requirementIdMap, roleId))
        .filter((rp) => rp !== null)
    )

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
