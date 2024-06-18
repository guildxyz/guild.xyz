import useGuild from "components/[guild]/hooks/useGuild"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Requirement, Role, RolePlatform } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirement from "utils/preprocessRequirement"

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

  const createRole = async (role: Role & { guildId: number }) => {
    try {
      return await onSubmit({ ...role, requirements: [{ type: "FREE" }] })
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

  const createRolePlatforms = async (rolePlatforms: RolePlatform[]) => {
    const promises = rolePlatforms.map((rolePlatform) =>
      fetcherWithSign([
        `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms`,
        { method: "POST", body: rolePlatform },
      ])
        .then((res) => ({ status: "fulfilled", result: res }))
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

  const submit = async (data) => {
    console.log(data)

    const { requirements, rolePlatforms, roleIds: rawRoleIds = [], ...role } = data
    const roleIds = rawRoleIds.map(Number)

    let createdRole = null
    if (roleIds.length == 0) {
      createdRole = await createRole(role)
      if (!createdRole) return
      roleIds.push(createdRole.id)
    }
    console.log("Created role: ", createdRole)

    const { createdRequirements, requirementIdMap } = await createRequirements(
      requirements,
      roleIds
    )
    console.log("Created requirements: ", createdRequirements)

    const transformedRolePlatforms = roleIds.flatMap((roleId) =>
      rolePlatforms
        .map((rp) => transformRolePlatform(rp, requirementIdMap, roleId))
        .filter((rp) => rp !== null)
    )

    console.log("Transformed role platforms: ", transformedRolePlatforms)

    const createdRolePlatforms = await createRolePlatforms(transformedRolePlatforms)

    console.log("Created role platforms: ", createdRolePlatforms)

    return { createdRole, createdRequirements, createdRolePlatforms }
  }

  const { onSubmit: submitWrapper, isLoading } = useSubmit(submit, {
    onSuccess: (res) => {
      const { createdRole, createdRequirements, createdRolePlatforms } = res

      toast({
        title: "Role successfully created",
        status: "success",
      })

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
