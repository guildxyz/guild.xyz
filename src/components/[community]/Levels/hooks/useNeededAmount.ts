import useBalance from "hooks/useBalance"
import { Token } from "temporaryData/types"

const useNeededAmount = (requiredAmount: number, stakeToken: Token) => {
  const stakeBalance = useBalance(stakeToken)

  return requiredAmount - stakeBalance
}

export default useNeededAmount
