import { MysteryBoxGetResponse } from "pages/api/leaderboard/mystery-box/[address]"
import useSWRImmutable from "swr/immutable"
import { useAccount } from "wagmi"

const useHasAlreadyClaimedMysteryBox = () => {
  const { address } = useAccount()

  const swrImmutable = useSWRImmutable<MysteryBoxGetResponse>(
    address ? `/api/leaderboard/mystery-box/${address}` : null
  )

  return {
    ...swrImmutable,
    data: swrImmutable.data ?? ({} as MysteryBoxGetResponse),
  }
}

export default useHasAlreadyClaimedMysteryBox
