import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"

const useNeededAmount = (requiredAmount: number) => {
  const {
    chainData: { stakeToken },
  } = useCommunity()
  const stakeBalance = useBalance(stakeToken)

  return requiredAmount - stakeBalance
}

export default useNeededAmount
