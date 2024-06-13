import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useFetcherWithSign } from "utils/fetcher"

const useRemoveReward = () => {
  const fetcherWithSign = useFetcherWithSign()
  const { id, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (data: { roleId: number; rolePlatformId: number }) =>
    fetcherWithSign([
      `/v2/guilds/${id}/roles/${data.roleId}/role-platforms/${data.rolePlatformId}`,
      {
        method: "DELETE",
        signOptions: {
          forcePrompt: true,
        },
      },
    ])

  return useSubmit<{ roleId: number; rolePlatformId: number }, any>(submit, {
    onSuccess: (response) => {
      toast({
        title: "Reward removed!",
        status: "success",
      })

      mutateGuild()
      // TODO: mutate gateables
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useRemoveReward
