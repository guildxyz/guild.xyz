import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Requirement } from "types"
import fetcher from "utils/fetcher"

const useCreateRequirement = (
  roleId: number,
  config?: { onSuccess?: () => void }
) => {
  const { id: guildId, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const createRequirement = async (
    signedValidation: SignedValidation
  ): Promise<Requirement> =>
    fetcher(`/v2/guilds/${guildId}/roles/${roleId}/requirements`, signedValidation)

  return useSubmitWithSign<Requirement>(createRequirement, {
    onSuccess: (newRequirement) => {
      toast({
        status: "success",
        title: "Successfully created requirement",
      })

      mutateGuild((prevGuild) => ({
        ...prevGuild,
        roles: prevGuild.roles.map((role) => {
          if (role.id !== roleId) return role

          return { ...role, requirements: [...role.requirements, newRequirement] }
        }),
      }))

      // TODO: trigger membership update - if one is already in progress, we should cancel that first

      config?.onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useCreateRequirement
