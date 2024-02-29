import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Requirement } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirement from "utils/preprocessRequirement"

const useEditRequirement = (roleId: number, config?: { onSuccess?: () => void }) => {
  const { id: guildId, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const fetcherWithSign = useFetcherWithSign()
  const editRequirement = async (data: Requirement): Promise<Requirement> =>
    fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${roleId}/requirements/${data.id}`,
      {
        method: "PUT",
        body: preprocessRequirement({
          ...data,
          id: undefined,
        }),
      },
    ])

  return useSubmit<Requirement, Requirement & { deletedRequirements?: number[] }>(
    editRequirement,
    {
      onSuccess: (editedRequirement) => {
        toast({
          status: "success",
          title: "Successfully updated requirement",
        })

        mutateGuild(
          (prevGuild) => ({
            ...prevGuild,
            roles: prevGuild.roles.map((role) => {
              if (role.id !== roleId) return role

              return {
                ...role,
                requirements: role.requirements.map((requirement) => {
                  if (requirement.id !== editedRequirement.id) return requirement
                  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
                  const { deletedRequirements: _, ...req } = editedRequirement
                  return req
                }),
              }
            }),
          }),
          {
            revalidate: false,
          }
        )

        config?.onSuccess?.()
      },
      onError: (error) => showErrorToast(error),
    }
  )
}

export default useEditRequirement
