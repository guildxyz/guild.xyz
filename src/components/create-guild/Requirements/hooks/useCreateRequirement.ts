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
    Requirement
  >(createRequirement, {
    onSuccess: (newRequirement) => {
      mutateGuild(
        (prevGuild) => ({
          ...prevGuild,
          roles: prevGuild.roles.map((role) => {
            if (role.id !== roleId) return role

            return { ...role, requirements: [...role.requirements, newRequirement] }
          }),
        }),
        { revalidate: false }
      )

      // TODO: trigger membership update - if one is already in progress, we should cancel that first

      config?.onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useCreateRequirement
