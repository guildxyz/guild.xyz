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

  const dataToSubmit: {
    platform: PlatformName
    addressSignedMessage: string
    roleId: number
    platformUserId?: string
  } = { platform, roleId, addressSignedMessage }

  if (platformUserId) dataToSubmit.platformUserId = platformUserId

  const submit = (): Promise<Response> =>
    fetcher(`/user/joinPlatform`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    })

  return useSubmit<any, Response>(submit, {
    // revalidating the address list in the AccountModal component
    onSuccess: () => mutate(`/user/${addressSignedMessage}`),
  })
}

export default useJoinPlatform
