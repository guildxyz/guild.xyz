import { useWeb3React } from "@web3-react/core"
import useKeyPair from "components/_app/useKeyPairContext"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useRouter } from "next/router"
import { Guild } from "types"

const useGuild = (guildId?: string | number) => {
  const router = useRouter()

  const id = guildId ?? router.query.guild

  const { keyPair } = useKeyPair()
  const { account } = useWeb3React()

  const { data, mutate, isLoading } = useSWRWithOptionalAuth<Guild>(
    id ? `/v2/guilds/guild-page/${id}` : null,
    undefined,
    undefined,
    false
  )

  return {
    ...data,
    isDetailed: !!keyPair && !!account && !!data,
    isLoading,
    mutateGuild: mutate,
  }
}

export default useGuild
