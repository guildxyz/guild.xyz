import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit/useSubmit"
import { OneOf } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import { RoleEditFormData } from "../EditRole"

const mapToObject = <T extends { id: number }>(array: T[], by: keyof T = "id") =>
  Object.fromEntries(array.map((item) => [item[by], item]))

const useEditRole = (roleId: number, onSuccess?: () => void) => {
  const { id, mutateGuild } = useGuild()
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const errorToast = useShowErrorToast()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()
  const { rewardCreated } = useCustomPosthogEvents()

  const submit = async (data: RoleEditFormData) => {
    const {
      rolePlatforms,
      // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
      id: _id,
      ...baseRoleData
    } = data

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

    const rolePlatformsToCreate = (rolePlatforms ?? []).filter(
      (rolePlatform) => !("id" in rolePlatform)
    )

    const rolePlatformCreations = Promise.all(
      rolePlatformsToCreate.map((rolePlatform) =>
        fetcherWithSign([
          `/v2/guilds/${id}/roles/${roleId}/role-platforms`,
          { method: "POST", body: rolePlatform },
        ]).catch((error) => error)
      )
    )

    const [updatedRole, updatedRolePlatforms, createdRolePlatforms] =
      await Promise.all([roleUpdate, rolePlatformUpdates, rolePlatformCreations])

    return {
      updatedRole,
      updatedRolePlatforms,
      createdRolePlatforms,
    }
  }

  const useSubmitResponse = useSubmit(submit, {
    onSuccess: (result) => {
      const { updatedRole, updatedRolePlatforms, createdRolePlatforms } = result

      if (createdRolePlatforms?.length > 0) {
        createdRolePlatforms.forEach((rolePlatform) => {
          if (rolePlatform?.createdGuildPlatform) {
            rewardCreated(rolePlatform.createdGuildPlatform.platformId)
          }
        })
      }

      const [failedRolePlatformUpdatesCount, failedRolePlatformCreationsCount] = [
        updatedRolePlatforms.filter((req) => !!req.error).length,
        createdRolePlatforms.filter((req) => !!req.error).length,
      ]

      const [successfulRolePlatformUpdates, successfulRolePlatformCreations] = [
        updatedRolePlatforms.filter((res) => !res.error),
        createdRolePlatforms.filter((res) => !res.error),
      ]

      const [
        failedRolePlatformUpdatesCorrelationId,
        failedRolePlatformCreationsCorrelationId,
      ] = [
        updatedRolePlatforms.filter((req) => !!req.error)[0]?.correlationId,
        createdRolePlatforms.filter((req) => !!req.error)[0]?.correlationId,
      ]

      if (
        !updatedRole?.error &&
        failedRolePlatformUpdatesCount <= 0 &&
        failedRolePlatformCreationsCount <= 0
      ) {
        onSuccess?.()
      } else {
        if (updatedRole?.error) {
          errorToast({
            error: "Failed to update role",
            correlationId: updatedRole.correlationId,
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

      triggerMembershipUpdate()
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) => {
      if (!!data.logic && data.logic !== "ANY_OF") delete data.anyOfNum
      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
    isSigning: null,
    signLoadingText: null,
  }
}

export default useEditRole
