import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useDeleteRequirement = (
  roleId: number,
  requirementId: number,
  onSuccess?: () => void
) => {
  const { id } = useGuild()
  const { mutate: mutateRequirements } = useRequirements(roleId)
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/roles/${roleId}/requirements/${requirementId}`, {
      method: "DELETE",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(submit, {
    onSuccess: () => {
      toast({
        title: "Requirement deleted!",
        status: "success",
      })
      onSuccess?.()

      /**
       * Delaying state change so we can close the modal and return focus to the
       * delete button before the card unmounts, so the page doesn't jump to the top
       */
      setTimeout(() => {
        mutateRequirements(
          (prevRequirements) =>
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
            prevRequirements.filter(
              (requirement) => requirement.id !== requirementId
            ),
          { revalidate: false }
        )
      }, 200)

      triggerMembershipUpdate()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDeleteRequirement
