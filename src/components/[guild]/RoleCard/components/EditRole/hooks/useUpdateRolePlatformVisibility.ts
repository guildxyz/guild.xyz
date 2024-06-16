import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RolePlatform, Visibility } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import useLocalMutateRolePlatform from "./useLocalMutateRolePlatform"

type Props = {
  rolePlatform: RolePlatform
  visibility: Visibility
  visibilityRoleId: number
}

type MutateProps = { id: number; visibility: Visibility; visibilityRoleId: number }

const useUpdateRolePlatformVisibility = () => {
  const { id: guildId } = useGuild()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()
  const mutateRolePlatform = useLocalMutateRolePlatform()
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

  return useSubmit<Props, MutateProps>(submit, {
    onSuccess: (response) => {
      toast({
        title: "Reward updated!",
        status: "success",
      })
      const { id, ...rolePlatformData } = response
      mutateRolePlatform(id, rolePlatformData)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useUpdateRolePlatformVisibility
