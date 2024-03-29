import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { Group } from "types"
import fetcher from "utils/fetcher"

const useEditRoleGroup = (groupId: number, onSuccess: () => void) => {
  const { id, mutateGuild } = useGuild()
  const { urlName } = useGuild()
  const { replace } = useRouter()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const editRoleGroup = (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/groups/${groupId}`, {
      ...signedValidation,
      method: "PUT",
    })

  return useSubmitWithSign<Group>(editRoleGroup, {
    onSuccess: (response) => {
      replace(`/${urlName}/${response.urlName}`)
      toast({
        status: "success",
        title: "Successfully edited page",
      })
      mutateGuild(
        (curr) => ({
          ...curr,
          groups: curr.groups.map((group) =>
            group.id !== groupId ? group : response
          ),
        }),
        { revalidate: false }
      )
      onSuccess()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEditRoleGroup
