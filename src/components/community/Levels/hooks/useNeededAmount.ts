import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"
import type { AccessRequirement } from "temporaryData/types"

const useNeededAmount = (accessRequirement: AccessRequirement) => {
  const {
    chainData: { stakeToken },
  } = useCommunity()
  const stakeBalance = useBalance(stakeToken)

  return accessRequirement.amount - stakeBalance
}

export default useNeededAmount
