import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"
import type { AccessRequirement } from "temporaryData/types"
import useNeededAmount from "../../../hooks/useNeededAmount"

const useLevelAccess = (accessRequirement: AccessRequirement): [boolean, string] => {
  const {
    chainData: { token, stakeToken },
  } = useCommunity()
  const tokenBalance = useBalance(token)
  const stakeBalance = useBalance(stakeToken)
  const neededAmount = useNeededAmount(accessRequirement)
  const { active } = useWeb3React()

  if (!active) return [false, "Wallet not connected"]

  if (accessRequirement.type === "open") return [true, ""]

  if (stakeBalance >= accessRequirement.amount) return [true, ""]

  if (tokenBalance < neededAmount) return [false, "Insufficient balance"]

  if (accessRequirement.type === "hold") return [true, ""]

  return [false, ""]
}

export default useLevelAccess
