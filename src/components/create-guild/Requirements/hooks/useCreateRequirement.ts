import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { Requirement } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirement from "utils/preprocessRequirement"

const useCreateRequirement = (
  roleId: number,
  config?: { onSuccess?: () => void }
) => {
  const { id: guildId, mutateGuild } = useGuild()
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
      mutateGuild(
        (prevGuild) => ({
          ...prevGuild,
          roles: prevGuild.roles.map((role) => {
            if (role.id !== roleId) return role

            return {
              ...role,
              requirements: [
                ...role.requirements?.filter((req) =>
                  Array.isArray(response.deletedRequirements)
                    ? !response.deletedRequirements.includes(req.id)
                    : true
                ),
                response,
              ],
            }
          }),
        }),
        { revalidate: false }
      )

      config?.onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useCreateRequirement
