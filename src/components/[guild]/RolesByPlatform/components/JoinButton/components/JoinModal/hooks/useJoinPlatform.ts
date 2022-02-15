import { useWeb3React } from "@web3-react/core"
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
  const { account } = useWeb3React()

  const submit = (): Promise<Response> =>
    fetcher(`/user/joinPlatform`, {
      method: "POST",
      body: {
        platform,
        roleId,
        platformUserId,
      },
    })

  return useSubmit<any, Response>(submit, {
    // Revalidating the address list in the AccountModal component
    onSuccess: () => mutate(`/user/${account}`),
  })
}

export default useJoinPlatform
