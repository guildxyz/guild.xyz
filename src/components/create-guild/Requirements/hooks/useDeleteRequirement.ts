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
  const { id, roles, mutateGuild } = useGuild()
  const role = roles?.find((r) => r.id === roleId)
  const { data: requirements, mutate: mutateRequirements } = useRequirements(roleId)
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

      if (
        role?.logic === "ANY_OF" &&
        (role.anyOfNum ?? 0) === (requirements?.length ?? 0) - 1
      ) {
        mutateGuild(
          (prevGuild) =>
            prevGuild
              ? {
                  ...prevGuild,
                  roles: prevGuild.roles.map((r) => {
                    if (r.id !== roleId) return r

                    /**
                     * We want to keep the role's original behaviour after deleting a requirement.
                     *
                     * E.g.: The role has 4 requirements and `anyOfNum` is set to 3, so the users should satisfy at least 3 requirements. If we delete a requirement, the role will have 3 requirements, which means the users should satisfy all of them, that's why we change `logic` to `AND` & set `anyOfNum` to `undefined` here.
                     */
                    return {
                      ...r,
                      logic: "AND",
                      anyOfNum: undefined,
                    }
                  }),
                }
              : undefined,
          { revalidate: false }
        )
      }

      /**
       * Delaying state change so we can close the modal and return focus to the
       * delete button before the card unmounts, so the page doesn't jump to the top
       */
      setTimeout(() => {
        mutateRequirements(
          (prevRequirements) =>
            prevRequirements.filter(
              (requirement) => requirement.id !== requirementId
            ),
          { revalidate: false }
        )
      }, 200)

      triggerMembershipUpdate({ roleIds: [roleId] })
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDeleteRequirement
