import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useHall from "components/[hall]/hooks/useHall"
import usePersonalSign from "hooks/usePersonalSign"
import { useSubmitWithSign } from "hooks/useSubmit"
import { mutate } from "swr"
import { PlatformName } from "temporaryData/types"

type Response = {
  inviteLink: string
  alreadyJoined?: boolean
}

const useJoinPlatform = (platform: PlatformName, platformUserId: string) => {
  const hall = useHall()
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
        groupId: hall?.id,
        guildId: guild?.id,
        addressSignedMessage,
        platformUserId,
      }),
    }).then((response) => (response.ok ? response.json() : Promise.reject(response)))

  // Mutating the user SWR, so it updates the address list in the AccountModal component
  return useSubmitWithSign<any, Response>(submit, {
    onSuccess: () => mutate(["user", account]),
  })
}

export default useJoinPlatform
