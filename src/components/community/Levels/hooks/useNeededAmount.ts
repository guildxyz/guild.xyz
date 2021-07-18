import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"
import { useMemo } from "react"
import type { AccessRequirement } from "temporaryData/types"

const useNeededAmount = (accessRequirement: AccessRequirement) => {
  const {
    chainData: { stakeToken },
  } = useCommunity()
  const stakeBalance = useBalance(stakeToken)

  return useMemo(
    () =>
      accessRequirement.type === "stake"
        ? accessRequirement.amount - stakeBalance
        : accessRequirement.amount,
    [accessRequirement, stakeBalance]
  )
}

export default useNeededAmount
