import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useAddReward = (onSuccess?) => {
  const { id, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const fetchData = async (signedValdation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms`, signedValdation)

  const { onSubmit, ...rest } = useSubmitWithSign(fetchData, {
    onError: (err) => showErrorToast(err),
    onSuccess: () => {
      toast({ status: "success", title: "Reward successfully added" })
      mutateGuild()
      onSuccess?.()
    },
  })

  return {
    onSubmit: (data) =>
      onSubmit({
        ...data.rolePlatforms[0].guildPlatform,
        roleIds: data.roleIds?.filter((roleId) => !!roleId),
      }),
    ...rest,
  }
}

export default useAddReward
