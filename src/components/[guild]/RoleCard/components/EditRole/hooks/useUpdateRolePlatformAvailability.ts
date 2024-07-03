import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RolePlatform } from "types"
import useLocalMutateRolePlatform from "./useLocalMutateRolePlatform"

type Props = {
  rolePlatform: RolePlatform
  capacity?: number
  startTime?: string
  endTime?: string
}

type MutateProps = {
  id: number
  capacity: number
  startTime?: string
  endTime?: string
}

const useUpdateRolePlatformAvailability = () => {
  const { id: guildId } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()
  const mutateRolePlatform = useLocalMutateRolePlatform()

  const submit = async (data: Props) => {
    const { rolePlatform, capacity, startTime, endTime } = data
    const updatedRolePlatform = {
      ...rolePlatform,
      capacity,
      startTime,
      endTime,
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
export default useUpdateRolePlatformAvailability
