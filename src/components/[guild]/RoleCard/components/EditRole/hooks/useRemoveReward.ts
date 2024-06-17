import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import { PlatformType, RolePlatform } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useRemoveReward = () => {
  const fetcherWithSign = useFetcherWithSign()
  const { id, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { mutate } = useSWRConfig()
  const { id: userId } = useUser()

  const submit = async (rolePlatform: RolePlatform) =>
    fetcherWithSign([
      `/v2/guilds/${id}/roles/${rolePlatform.roleId}/role-platforms/${rolePlatform.id}`,
      {
        method: "DELETE",
        signOptions: {
          forcePrompt: true,
        },
      },
    ])

  const mutateGateables = (platformId: number) => {
    mutate(`/v2/users/${userId}/platforms/${PlatformType[platformId]}/gateables`)
  }

  return useSubmit<RolePlatform, any>(submit, {
    onSuccess: (response) => {
      toast({
        title: "Reward removed!",
        status: "success",
      })

      // TODO: need response from backend to execute mutate
      mutateGuild()
      // TODO: mutate gateables
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useRemoveReward
