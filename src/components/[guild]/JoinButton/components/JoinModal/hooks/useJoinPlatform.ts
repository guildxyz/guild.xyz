import { useGuild } from "components/[guild]/Context"
import { useHall } from "components/[hall]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import useSubmit from "hooks/useSubmit"
import { PlatformName } from "temporaryData/types"

type Response = {
  inviteLink: string
  alreadyJoined?: boolean
}

const useJoinPlatform = (platform: PlatformName, platformUserId: string) => {
  const hall = useHall()
  const guild = useGuild()
  const { addressSignedMessage } = usePersonalSign()

  const submit = (): Promise<Response> =>
    fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform,
        groupId: hall?.id,
        guildId: guild?.id,
        addressSignedMessage,
        platformUserId,
      }),
    }).then((response) => (response.ok ? response.json() : Promise.reject(response)))

  return useSubmit<any, Response>(submit)
}

export default useJoinPlatform
