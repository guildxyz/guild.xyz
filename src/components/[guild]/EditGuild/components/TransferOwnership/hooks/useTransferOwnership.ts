import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useFetcherWithSign } from "utils/fetcher"

const useTransferOwnership = ({ onSuccess }) => {
  const { id } = useGuild()
  const fetcherWithSign = useFetcherWithSign()
  const submit = async ({ to }: { to: string }) =>
    fetcherWithSign([
      `/v2/guilds/${id}/admins/${to}`,
      {
        method: "PUT",
        body: {
          isOwner: true,
        },
        signOptions: {
          forcePrompt: true,
        },
      },
    ])
  const showErrorToast = useShowErrorToast()

  return useSubmit(submit, {
    onSuccess: (res) => {
      if (onSuccess) onSuccess(res)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useTransferOwnership
