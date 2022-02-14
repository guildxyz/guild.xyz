import { useWeb3React } from "@web3-react/core"
import usePersonalSign from "hooks/usePersonalSign"
import useSubmit from "hooks/useSubmit"
import { mutate } from "swr"
import { PlatformName } from "types"
import fetcher from "utils/fetcher"

type Response = {
  inviteLink: string
  alreadyJoined?: boolean
}

const useJoinPlatform = (
  platform: PlatformName,
  platformUserId: string,
  roleId: number
) => {
  const { addressSignedMessage } = usePersonalSign()
  const { account } = useWeb3React()

  const submit = (): Promise<Response> =>
    fetcher(`/user/joinPlatform`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform,
        roleId,
        addressSignedMessage,
        platformUserId,
      }),
    })

  return useSubmit<any, Response>(submit, {
    // Revalidating the address list in the AccountModal component
    onSuccess: () => mutate(`/user/${addressSignedMessage}`),
  })
}

export default useJoinPlatform
