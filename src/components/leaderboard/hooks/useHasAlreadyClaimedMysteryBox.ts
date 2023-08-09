import { useWeb3React } from "@web3-react/core"
import { MysteryBoxGetResponse } from "pages/api/leaderboard/mystery-box/[address]"
import useSWRImmutable from "swr/immutable"

const useHasAlreadyClaimedMysteryBox = () => {
  const { account } = useWeb3React()

  const swrImmutable = useSWRImmutable<MysteryBoxGetResponse>(
    account ? `/api/leaderboard/mystery-box/${account}` : null
  )

  return {
    ...swrImmutable,
    data: swrImmutable.data ?? ({} as MysteryBoxGetResponse),
  }
}

export default useHasAlreadyClaimedMysteryBox
