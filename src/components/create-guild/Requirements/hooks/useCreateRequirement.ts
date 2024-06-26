import { Schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { RequirementCreateResponseOutput } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirement from "utils/preprocessRequirement"

const useCreateRequirement = (
  roleId: number,
  config?: { onSuccess?: () => void; onError?: (err) => void }
) => {
  const { id: guildId } = useGuild()
  const { mutate: mutateRequirements } = useRequirements(roleId)
  const showErrorToast = useShowErrorToast()

  const fetcherWithSign = useFetcherWithSign()
  const createRequirement = async (
    body?: Schemas["RequirementCreationPayload"]
  ): Promise<RequirementCreateResponseOutput> =>
    fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
      {
        method: "POST",
        body: preprocessRequirement(body),
      },
    ])

  return useSubmit<
    Schemas["RequirementCreationPayload"],
    RequirementCreateResponseOutput
  >(createRequirement, {
    onSuccess: (response) => {
      if (
        (response.type === "ALLOWLIST" || response.type === "ALLOWLIST_EMAIL") &&
        response.data?.fileId
      ) {
        // TODO: add the "status" prop to the schema
        ;(response.data as any).status = "IN-PROGRESS"
      }

      mutateRequirements(
        (prevRequirements) => [
          ...prevRequirements.filter((req) =>
            Array.isArray(response.deletedRequirements)
              ? !response.deletedRequirements.includes(req.id)
              : true
          ),
          response,
        ],
        { revalidate: false }
      )

      config?.onSuccess?.()
    },
    onError: (error) => {
      showErrorToast(error)
      config?.onError?.(error)
    },
  })
}

export default useCreateRequirement
