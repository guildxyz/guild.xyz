import {
  countFailed,
  getCorrelationId,
} from "components/[guild]/EditGuild/hooks/useEditGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit, { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { GuildPoap, Logic } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirements from "utils/preprocessRequirements"

const useUpdatePoapRequirements = (
  guildPoap: GuildPoap,
  { onSuccess }: UseSubmitOptions
) => {
  const showErrorToast = useShowErrorToast()

  const { mutateGuild, poaps, id: guildId } = useGuild()
  const fetcherWithSign = useFetcherWithSign()

  const updatePoapRequirements = async (body: {
    logic: Logic
    requirements: Omit<GuildPoap["poapRequirements"], "logic">
  }) => {
    const existingPoapRequirements = poaps?.flatMap((poap) => poap.poapRequirements)

    const poapRequirementsToCreate =
      body?.requirements?.filter((req) => !req.id) ?? []
    const poapRequirementsToDelete =
      existingPoapRequirements?.filter(
        (existingReq) =>
          !body?.requirements?.find((req) => req.id === existingReq.id)
      ) ?? []
    const poapRequirementsToUpdate =
      body?.requirements?.filter((req) => !!req.id) ?? []

    const updates = Promise.all(
      poapRequirementsToUpdate.map((req) =>
        fetcherWithSign([
          `/v2/guilds/${guildId}/poaps/${guildPoap?.id}/requirements/${req.id}`,
          { method: "PUT", body: { ...req, logic: body?.logic, id: undefined } },
        ]).catch((error) => error)
      )
    )

    const creations = Promise.all(
      poapRequirementsToCreate.map((req) =>
        fetcherWithSign([
          `/v2/guilds/${guildId}/poaps/${guildPoap?.id}/requirements`,
          { method: "POST", body: { ...req, logic: body?.logic } },
        ]).catch((error) => error)
      )
    )

    const deletions = Promise.all(
      poapRequirementsToDelete.map((req) =>
        fetcherWithSign([
          `/v2/guilds/${guildId}/poaps/${guildPoap?.id}/requirements/${req.id}`,
          { method: "DELETE" },
        ])
          .then(() => req.id)
          .catch((error) => error)
      )
    )

    const [creationResults, updateResults, deletionResults] = await Promise.all([
      creations,
      updates,
      deletions,
    ])

    return {
      creations: {
        success: creationResults.filter((res) => !res.error),
        failedCount: countFailed(creationResults),
        correlationId: getCorrelationId(creationResults),
      },
      updates: {
        success: updateResults.filter((res) => !res.error),
        failedCount: countFailed(updateResults),
        correlationId: getCorrelationId(updateResults),
      },
      deletions: {
        success: deletionResults.filter((res) => !res.error),
        failedCount: countFailed(deletionResults),
        correlationId: getCorrelationId(deletionResults),
      },
    } as const
  }

  const toast = useToast()

  const { onSubmit, ...rest } = useSubmit(updatePoapRequirements, {
    onError: (error) => showErrorToast(error),
    onSuccess: async ({ creations, deletions, updates }) => {
      if (
        creations.failedCount <= 0 &&
        deletions.failedCount <= 0 &&
        updates.failedCount <= 0
      ) {
        toast({
          title: `Role successfully updated!`,
          status: "success",
        })
      } else {
        if (creations.failedCount > 0) {
          showErrorToast({
            error: "Failed to create some requirements",
            correlationId: creations.correlationId,
          })
        }
        if (updates.failedCount > 0) {
          showErrorToast({
            error: "Failed to update some requirements",
            correlationId: updates.correlationId,
          })
        }
        if (deletions.failedCount > 0) {
          showErrorToast({
            error: "Failed to delete some requirements",
            correlationId: deletions.correlationId,
          })
        }
      }

      mutateGuild(
        (prev) => ({
          ...prev,
          poaps: prev?.poaps?.map((prevPoap) =>
            prevPoap?.id !== guildPoap?.id
              ? prevPoap
              : {
                  ...prevPoap,
                  poapRequirements: [...updates?.success, ...creations?.success],
                }
          ),
        }),
        { revalidate: false }
      )

      onSuccess?.()
    },
  })

  return {
    ...rest,
    onSubmit: (data) => {
      data.requirements = preprocessRequirements(data?.requirements)
      return onSubmit(data)
    },
  }
}

export default useUpdatePoapRequirements
