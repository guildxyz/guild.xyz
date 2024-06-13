import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RolePlatform, Visibility } from "types"
import { useFetcherWithSign } from "utils/fetcher"

type Props = {
  rolePlatform: RolePlatform
  visibility: Visibility
  visibilityRoleId: number
}

const useUpdateRolePlatformVisibility = () => {
  const { id: guildId, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()
  const toast = useToast()

  const submit = async (data: Props) => {
    const { rolePlatform, visibility, visibilityRoleId } = data
    const updatedRolePlatform = {
      ...rolePlatform,
      visibility,
      visibilityRoleId,
    }

    return fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms/${rolePlatform.id}`,
      { method: "PUT", body: updatedRolePlatform },
    ])
  }

  return useSubmit<Props, any>(submit, {
    onSuccess: (response) => {
      toast({
        title: "Reward updated!",
        status: "success",
      })

      mutateGuild()
      // TODO: mutate gateables
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useUpdateRolePlatformVisibility
