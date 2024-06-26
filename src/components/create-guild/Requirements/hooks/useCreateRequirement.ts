import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { Requirement } from "types"
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
  const createRequirement = async (body: Requirement): Promise<Requirement> =>
    fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
      {
        method: "POST",
        body: preprocessRequirement(body),
      },
    ])

  return useSubmit<
    Omit<Requirement, "id" | "roleId" | "name" | "symbol">,
    Requirement & { deletedRequirements?: number[] }
  >(createRequirement, {
    onSuccess: (response) => {
      if (
        (response.type === "ALLOWLIST" || response.type === "ALLOWLIST_EMAIL") &&
        response.data?.fileId
      ) {
        response.data ??= {}
        response.data.status = "IN-PROGRESS"
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
