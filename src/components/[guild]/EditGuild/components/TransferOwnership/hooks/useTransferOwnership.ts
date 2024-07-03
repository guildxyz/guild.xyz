import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"

type DataType = {
  to: string
}

type ResponseType = {
  guildId: number
  userId: number
  isOwner: boolean
}

const useTransferOwnership = ({
  onSuccess,
}: {
  onSuccess: (res: ResponseType) => void
}) => {
  const { id } = useGuild()
  const fetcherWithSign = useFetcherWithSign()

  const submit = async ({ to }: DataType) =>
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

  return useSubmit<DataType, ResponseType>(submit, {
    onSuccess: (res) => {
      if (onSuccess) onSuccess(res)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useTransferOwnership
