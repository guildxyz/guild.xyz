import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RolePlatform } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import useLocalMutateRolePlatform from "./useLocalMutateRolePlatform"

type Props = {
  rolePlatform: RolePlatform
  updateData: any
}

type MutateProps = {
  id: number
  updateData: any
}

const useUpdateRolePlatform = () => {
  const { id: guildId } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()
  const mutateRolePlatform = useLocalMutateRolePlatform()

  const submit = async (data: Props) => {
    const { rolePlatform, updateData } = data
    const updatedRolePlatform = {
      ...rolePlatform,
      ...updateData,
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
      mutateRolePlatform(id, rolePlatformData as Partial<RolePlatform>)
    },
    onError: (error) => showErrorToast(error),
  })
}
export default useUpdateRolePlatform
