import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useAddReward = (onSuccess?) => {
  const { id, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const fetchData = async ({ validation, data }: WithValidation<any>) =>
    fetcher(`/guild/${id}/platform`, {
      validation,
      body: data,
    })

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
        roleIds: data.roleIds.filter((roleId) => !!roleId),
      }),
    ...rest,
  }
}

export default useAddReward
