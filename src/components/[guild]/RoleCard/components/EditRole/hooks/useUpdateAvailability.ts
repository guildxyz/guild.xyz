import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RolePlatform } from "types"
import { useFetcherWithSign } from "utils/fetcher"

type Props = {
  rolePlatform: RolePlatform
  capacity?: number
  startTime?: string
  endTime?: string
}

const useUpdateAvailability = () => {
  const { id: guildId, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

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

export default useUpdateAvailability
