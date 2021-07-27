import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"
import useNeededAmount from "../../../hooks/useNeededAmount"

const useLevelAccess = (type: string, amount: number): [boolean, string] => {
  const { chainData, levels } = useCommunity()
  const tokenBalance = useBalance(chainData.token)
  const stakeBalance = useBalance(chainData.stakeToken)
  const neededAmount = useNeededAmount(amount)
  const { active } = useWeb3React()

  if (!levels.length) {
    return [tokenBalance > 0, ""]
  }

  if (!active) return [false, "Wallet not connected"]

  if (type === "OPEN") return [true, ""]

  if (stakeBalance >= amount) return [true, ""]

  if (tokenBalance < neededAmount) return [false, "Insufficient balance"]

  if (type === "HOLD") return [true, ""]

  return [false, ""]
}

export default useLevelAccess
