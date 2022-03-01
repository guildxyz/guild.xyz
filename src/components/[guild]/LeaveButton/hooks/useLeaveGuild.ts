import { useWeb3React } from "@web3-react/core"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { mutate } from "swr"
import fetcher from "utils/fetcher"

type Data = {
  guildId: number
}
type Response = any

const useLeaveGuild = () => {
  const { account, library } = useWeb3React()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = ({ validation, data }: WithValidation<Data>): Promise<Response> =>
    fetcher(`/user/leaveGuild`, {
      body: data,
      validation,
    })

  return useSubmitWithSign<Data, Response>(submit, {
    onSuccess: () => {
      toast({
        title: "You've successfully left this guild",
        status: "success",
      })
      mutate(`/user/getUserMemberships/${account}`)
      mutate(`/guild/address/${account}?order=members`)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useLeaveGuild
