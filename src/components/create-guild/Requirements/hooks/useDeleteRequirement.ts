import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useDeleteRequirement = (
  roleId: number,
  requirementId: number,
  onSuccess?: () => void
) => {
  const { mutateGuild, id } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (signedValidation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/roles/${roleId}/requirements/${requirementId}`, {
      method: "DELETE",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(submit, {
    onSuccess: () => {
      toast({
        title: `Requirement deleted!`,
        status: "success",
      })
      onSuccess?.()

      // Remove requirement from guild data
      mutateGuild(
        (prev) => ({
          ...prev,
          roles:
            prev?.roles?.map((role) =>
              role.id !== roleId
                ? role
                : {
                    ...role,
                    requirements:
                      role.requirements?.filter(
                        (requirement) => requirement.id !== requirementId
                      ) ?? [],
                  }
            ) ?? [],
        }),
        { revalidate: false }
      )
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDeleteRequirement
