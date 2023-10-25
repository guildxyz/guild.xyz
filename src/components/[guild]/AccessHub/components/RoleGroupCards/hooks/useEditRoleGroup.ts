import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Group } from "types"
import fetcher from "utils/fetcher"

const useEditRoleGroup = (groupId: number, onSuccess: (response: Group) => void) => {
  const { id, mutateGuild } = useGuild()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const editRoleGroup = (signedValidation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/groups/${groupId}`, {
      ...signedValidation,
      method: "PUT",
    })

  return useSubmitWithSign<Group>(editRoleGroup, {
    onSuccess: (response) => {
      toast({
        status: "success",
        title: "Successfully edited campaign",
      })
      mutateGuild((curr) => ({
        ...curr,
        groups: curr.groups.map((group) =>
          group.id !== groupId ? group : response
        ),
      }))
      onSuccess(response)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEditRoleGroup
