import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWR, { KeyedMutator } from "swr"

const usePoapLinks = (
  poapId: number
): {
  poapLinks: { total: number; claimed: number }
  isPoapLinksLoading: boolean
  mutate: KeyedMutator<any>
} => {
  const { account } = useWeb3React()
  const { poaps } = useGuild()
  const guildPoap = poaps?.find((p) => p.poapIdentifier === poapId)

  const {
    data: poapLinks,
    isValidating: isPoapLinksLoading,
    mutate,
  } = useSWR(poapId ? `/assets/poap/links/${poapId}` : null, {
    refreshInterval:
      account && guildPoap?.expiryDate > Date.now() / 1000 ? 10000 : 0,
  })

  return { poapLinks, isPoapLinksLoading, mutate }
}

export default usePoapLinks
