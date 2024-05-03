import useGuild from "components/[guild]/hooks/useGuild"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { Requirement } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirement from "utils/preprocessRequirement"

const useCreateRequirement = (config?: {
  onSuccess?: (resp) => void
  onError?: (err) => void
}) => {
  const { id: guildId } = useGuild()
  const showErrorToast = useShowErrorToast()

  const fetcherWithSign = useFetcherWithSign()
  const createRequirement = async ({
    requirement,
    roleId,
  }: {
    requirement: Requirement
    roleId: number
  }): Promise<Requirement> =>
    fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
      {
        method: "POST",
        body: preprocessRequirement(requirement),
      },
    ])

  const mutateRequirements = (
    req: Requirement,
    roleId: number,
    idForGuild: number
  ) => {
    mutateOptionalAuthSWRKey<Requirement[]>(
      `/v2/guilds/${idForGuild}/roles/${roleId}/requirements`,
      (prevRequirements) => [
        ...prevRequirements.filter((r) => r.type === "FREE"),
        req,
      ],
      { revalidate: false }
    )
  }

  return useSubmit<
    {
      requirement: Omit<Requirement, "id" | "roleId" | "name" | "symbol">
      roleId: number
    },
    Requirement & { deletedRequirements?: number[] }
  >(createRequirement, {
    onSuccess: (response) => {
      mutateRequirements(response, response.roleId, guildId)
      config?.onSuccess?.(response)
    },
    onError: (error) => {
      showErrorToast(error)
      config?.onError?.(error)
    },
  })
}

export default useCreateRequirement
