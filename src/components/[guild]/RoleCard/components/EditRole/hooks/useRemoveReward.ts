import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RolePlatform } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useRemoveReward = () => {
  const fetcherWithSign = useFetcherWithSign()
  const { id, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

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

  return useSubmit<RolePlatform, any>(submit, {
    onSuccess: (response) => {
      toast({
        title: "Reward removed!",
        status: "success",
      })

      // TODO: need response from backend to execute mutate
      console.log(response)

      mutateGuild()
      // TODO: mutate gateables
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useRemoveReward
