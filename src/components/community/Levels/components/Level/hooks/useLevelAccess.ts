import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"
import useNeededAmount from "../../../hooks/useNeededAmount"

const useLevelAccess = (type: string, amount: number): [boolean, string] => {
  const {
    chainData: { token, stakeToken },
  } = useCommunity()
  const tokenBalance = useBalance(token)
  const stakeBalance = useBalance(stakeToken)
  const neededAmount = useNeededAmount(amount)
  const { active } = useWeb3React()

  if (!active) return [false, "Wallet not connected"]

  if (type === "open") return [true, ""]

  if (stakeBalance >= amount) return [true, ""]

  if (tokenBalance < neededAmount) return [false, "Insufficient balance"]

  if (type === "hold") return [true, ""]

  return [false, ""]
}

export default useLevelAccess
