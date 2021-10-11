import useSWRSubmit from "components/index/hooks/useSWRSubmit"
import { useGuild } from "components/[guild]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import { PlatformName } from "temporaryData/types"

type Invite = {
  inviteLink: string
  alreadyJoined?: boolean
}

const getInviteLink = (
  _,
  platform: PlatformName,
  communityId: number,
  addressSignedMessage: string,
  platformUserId: string
): Promise<Invite> =>
  fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      platform,
      communityId,
      addressSignedMessage,
      platformUserId,
    }),
  }).then((response) => (response.ok ? response.json() : Promise.reject(response)))

const useJoinPlatform = (platform: PlatformName, platformUserId: string) => {
  const { id: communityId } = useGuild()
  const { addressSignedMessage } = usePersonalSign()

  return useSWRSubmit(
    ["join", platform, communityId, addressSignedMessage, platformUserId],
    getInviteLink
  )
}

export default useJoinPlatform
