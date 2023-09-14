import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit/useSubmit"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import { OneOf } from "types"
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
      OneOf<
        Omit<RoleEditFormData, "requirements" | "rolePlatforms">,
        { error: string; correlationId: string }
      >
    > =
      Object.keys(baseRoleData ?? {}).length > 0
        ? fetcherWithSign([
            `/v2/guilds/${id}/roles/${roleId}`,
            { method: "PUT", body: baseRoleData },
          ]).catch((error) => error)
        : new Promise((resolve) => resolve(undefined))

    const requirementUpdates = Promise.all(
      (requirements ?? [])
        .filter((reqirement) => "id" in reqirement)
        .map((requirement) =>
          fetcherWithSign([
            `/v2/guilds/${id}/roles/${roleId}/requirements/${requirement.id}`,
            { method: "PUT", body: requirement },
          ]).catch((error) => error)
        )
    )

    const requirementCreations = Promise.all(
      (requirements ?? [])
        .filter((reqirement) => !("id" in reqirement))
        .map((requirement) =>
          fetcherWithSign([
            `/v2/guilds/${id}/roles/${roleId}/requirements`,
            { method: "POST", body: requirement },
          ]).catch((error) => error)
        )
    )

    const rolePlatformUpdates = Promise.all(
      (rolePlatforms ?? [])
        .filter((rolePlatform) => "id" in rolePlatform)
        .map((rolePlatform) =>
          fetcherWithSign([
            `/v2/guilds/${id}/roles/${roleId}/role-platforms/${rolePlatform.id}`,
            { method: "PUT", body: rolePlatform },
          ]).catch((error) => error)
        )
    )

    const rolePlatformCreations = Promise.all(
      (rolePlatforms ?? [])
        .filter((rolePlatform) => !("id" in rolePlatform))
        .map((rolePlatform) =>
          fetcherWithSign([
            `/v2/guilds/${id}/roles/${roleId}/role-platforms`,
            { method: "POST", body: rolePlatform },
          ]).catch((error) => error)
        )
    )

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
    onSuccess: (result) => {
      const {
        updatedRole,
        updatedRequirements,
        createdRequirements,
        updatedRolePlatforms,
        createdRolePlatforms,
      } = result

      const deletedRequirementIds = new Set(
        createdRequirements.flatMap((req) => req.deletedRequirements)
      )

      const [
        failedRequirementUpdatesCount,
        failedRequirementCreationsCount,
        failedRolePlatformUpdatesCount,
        failedRolePlatformCreationsCount,
      ] = [
        updatedRequirements.filter((req) => !!req.error).length,
        createdRequirements.filter((req) => !!req.error).length,
        updatedRolePlatforms.filter((req) => !!req.error).length,
        createdRolePlatforms.filter((req) => !!req.error).length,
      ]

      const [
        successfulRequirementUpdates,
        successfulRequirementCreations,
        successfulRolePlatformUpdates,
        successfulRolePlatformCreations,
      ] = [
        updatedRequirements.filter((res) => !res.error),
        createdRequirements.filter((res) => !res.error),
        updatedRolePlatforms.filter((res) => !res.error),
        createdRolePlatforms.filter((res) => !res.error),
      ]

      const [
        failedRequirementUpdatesCorrelationId,
        failedRequirementCreationsCorrelationId,
        failedRolePlatformUpdatesCorrelationId,
        failedRolePlatformCreationsCorrelationId,
      ] = [
        updatedRequirements.filter((req) => !!req.error)[0]?.correlationId,
        createdRequirements.filter((req) => !!req.error)[0]?.correlationId,
        updatedRolePlatforms.filter((req) => !!req.error)[0]?.correlationId,
        createdRolePlatforms.filter((req) => !!req.error)[0]?.correlationId,
      ]

      if (
        !updatedRole?.error &&
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
        if (updatedRole.error) {
          errorToast({
            error: "Failed to update role",
            correlationId: updatedRole.correlationId,
          })
        }
        if (failedRequirementUpdatesCount > 0) {
          errorToast({
            error: "Failed to update some requirements",
            correlationId: failedRequirementUpdatesCorrelationId,
          })
        }
        if (failedRequirementCreationsCount > 0) {
          errorToast({
            error: "Failed to create some requirements",
            correlationId: failedRequirementCreationsCorrelationId,
          })
        }
        if (failedRolePlatformUpdatesCount > 0) {
          errorToast({
            error: "Failed to update some rewards",
            correlationId: failedRolePlatformUpdatesCorrelationId,
          })
        }
        if (failedRolePlatformCreationsCount > 0) {
          errorToast({
            error: "Failed to create some rewards",
            correlationId: failedRolePlatformCreationsCorrelationId,
          })
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
                      ...(prevRole.requirements
                        ?.filter(
                          (requirement) => !deletedRequirementIds.has(requirement)
                        )
                        ?.map((prevReq) => ({
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
    isSigning: null,
    signLoadingText: null,
  }
}

export default useEditRole
