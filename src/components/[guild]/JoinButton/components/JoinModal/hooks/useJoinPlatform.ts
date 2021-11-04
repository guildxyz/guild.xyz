import { useWeb3React } from "@web3-react/core"
import { useGroup } from "components/[group]/Context"
import { useGuild } from "components/[guild]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import useSubmit from "hooks/useSubmit"
import { mutate } from "swr"
import { PlatformName } from "temporaryData/types"

type Response = {
  inviteLink: string
  alreadyJoined?: boolean
}

const useJoinPlatform = (platform: PlatformName, platformUserId: string) => {
  const group = useGroup()
  const guild = useGuild()
  const { account } = useWeb3React()
  const { addressSignedMessage } = usePersonalSign()

  const submit = (): Promise<Response> =>
    fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform,
        groupId: group?.id,
        guildId: guild?.id,
        addressSignedMessage,
        platformUserId,
      }),
    }).then((response) => (response.ok ? response.json() : Promise.reject(response)))

  // Mutating the user SWR, so it updates the address list in the AccountModal component
  return useSubmit<any, Response>(submit, {
    onSuccess: () => mutate(["user", account]),
  })
}

export default useJoinPlatform
