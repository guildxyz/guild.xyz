import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import { useFetcherWithSign } from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"
import { RoleEditFormData } from "../EditRole"

const mapToObject = <T extends { id: number }>(array: T[], by: keyof T = "id") =>
  Object.fromEntries(array.map((item) => [item[by], item]))

const useEditRole = (roleId: number, onSuccess?: () => void) => {
  const { id, mutateGuild } = useGuild()
  const { account } = useWeb3React()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const errorToast = useShowErrorToast()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

  const submit = async (data: RoleEditFormData) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { requirements, rolePlatforms, id: _id, ...baseRoleData } = data

    const roleUpdate: Promise<
      Omit<RoleEditFormData, "requirements" | "rolePlatforms">
    > =
      Object.keys(baseRoleData ?? {}).length > 0
        ? fetcherWithSign([
            `/v2/guilds/${id}/roles/${roleId}`,
            { method: "PUT", body: baseRoleData },
          ]).catch(() => null)
        : new Promise((resolve) => resolve(undefined))

    const requirementUpdates = Promise.all(
      (requirements ?? [])
        .filter((reqirement) => "id" in reqirement)
        .map((requirement) =>
          fetcherWithSign([
            `/v2/guilds/${id}/roles/${roleId}/requirements/${requirement.id}`,
            { method: "PUT", body: requirement },
          ]).catch(() => null)
        )
    )

    const requirementCreations = Promise.all(
      (requirements ?? [])
        .filter((reqirement) => !("id" in reqirement))
        .map((requirement) =>
          fetcherWithSign([
            `/v2/guilds/${id}/roles/${roleId}/requirements`,
            { method: "POST", body: requirement },
          ]).catch(() => null)
        )
    )

    const rolePlatformUpdates = Promise.all(
      (rolePlatforms ?? [])
        .filter((rolePlatform) => "id" in rolePlatform)
        .map((rolePlatform) =>
          fetcherWithSign([
            `/v2/guilds/${id}/roles/${roleId}/role-platforms/${rolePlatform.id}`,
            { method: "PUT", body: rolePlatform },
          ]).catch(() => null)
        )
    )

    const rolePlatformCreations = Promise.all(
      (rolePlatforms ?? [])
        .filter((rolePlatform) => !("id" in rolePlatform))
        .map((rolePlatform) =>
          fetcherWithSign([
            `/v2/guilds/${id}/roles/${roleId}/role-platforms`,
            { method: "POST", body: rolePlatform },
          ]).catch(() => null)
        )
    )

    // TODO: Catch errors, collect them, and throw the collected errors, and trigger a toast for each of them
    const [
      updatedRole,
      updatedRequirements,
      createdRequirements,
      updatedRolePlatforms,
      createdRolePlatforms,
    ] = await Promise.all([
      roleUpdate,
      requirementUpdates,
      requirementCreations,
      rolePlatformUpdates,
      rolePlatformCreations,
    ])

    return {
      updatedRole,
      updatedRequirements,
      createdRequirements,
      updatedRolePlatforms,
      createdRolePlatforms,
    }
  }

  const useSubmitResponse = useSubmit(submit, {
    onSuccess: ({
      updatedRole,
      updatedRequirements,
      createdRequirements,
      updatedRolePlatforms,
      createdRolePlatforms,
    }) => {
      const [
        failedRequirementUpdatesCount,
        failedRequirementCreationsCount,
        failedRolePlatformUpdatesCount,
        failedRolePlatformCreationsCount,
      ] = [
        updatedRequirements.filter((req) => !req).length,
        createdRequirements.filter((req) => !req).length,
        updatedRolePlatforms.filter((req) => !req).length,
        createdRolePlatforms.filter((req) => !req).length,
      ]

      const [
        successfulRequirementUpdates,
        successfulRequirementCreations,
        successfulRolePlatformUpdates,
        successfulRolePlatformCreations,
      ] = [
        updatedRequirements.filter(Boolean),
        createdRequirements.filter(Boolean),
        updatedRolePlatforms.filter(Boolean),
        createdRolePlatforms.filter(Boolean),
      ]

      // Checking null explicitly for updatedRole, because undefined means that no role update has happened
      if (
        updatedRole !== null &&
        failedRequirementUpdatesCount <= 0 &&
        failedRequirementCreationsCount <= 0 &&
        failedRolePlatformUpdatesCount <= 0 &&
        failedRolePlatformCreationsCount <= 0
      ) {
        toast({
          title: `Role successfully updated!`,
          status: "success",
        })
      } else {
        if (updatedRole === null) {
          errorToast("Failed to update role")
        }
        if (failedRequirementUpdatesCount > 0) {
          errorToast("Failed to update some requirements")
        }
        if (failedRequirementCreationsCount > 0) {
          errorToast("Failed to create some requirements")
        }
        if (failedRolePlatformUpdatesCount > 0) {
          errorToast("Failed to update some rewards")
        }
        if (failedRolePlatformCreationsCount > 0) {
          errorToast("Failed to create some rewards")
        }
      }

      if (onSuccess) onSuccess()

      const updatedRequirementsById = mapToObject(successfulRequirementUpdates)
      const updatedRolePlatformsById = mapToObject(successfulRolePlatformUpdates)

      const createdRolePlatformsToMutate = successfulRolePlatformCreations.map(
        ({ createdGuildPlatform: _, ...rest }) => rest
      )

      const createdGuildPlatforms = successfulRolePlatformCreations
        .map(({ createdGuildPlatform }) => createdGuildPlatform)
        .filter(Boolean)

      mutateGuild(
        (prevGuild) => ({
          ...prevGuild,
          guildPlatforms: [...prevGuild.guildPlatforms, ...createdGuildPlatforms],
          roles:
            prevGuild.roles?.map((prevRole) =>
              prevRole.id === roleId
                ? {
                    ...prevRole,
                    ...(updatedRole ?? {}),
                    requirements: [
                      ...(prevRole.requirements?.map((prevReq) => ({
                        ...prevReq,
                        ...(updatedRequirementsById[prevReq.id] ?? {}),
                      })) ?? []),
                      ...successfulRequirementCreations,
                    ],
                    rolePlatforms: [
                      ...(prevRole.rolePlatforms?.map((prevRolePlatform) => ({
                        ...prevRolePlatform,
                        ...(updatedRolePlatformsById[prevRolePlatform.id] ?? {}),
                      })) ?? []),
                      ...createdRolePlatformsToMutate,
                    ],
                  }
                : prevRole
            ) ?? [],
        }),
        { revalidate: false }
      )
      mutateOptionalAuthSWRKey(`/guild/access/${id}/${account}`)
      mutate(`/statusUpdate/guild/${id}`)
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) => {
      data.requirements = preprocessRequirements(data?.requirements)

      if (!!data.logic && data.logic !== "ANY_OF") delete data.anyOfNum

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useEditRole
