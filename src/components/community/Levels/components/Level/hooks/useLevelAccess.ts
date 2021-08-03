import { useWeb3React } from "@web3-react/core"
import useBalance from "hooks/useBalance"
import { Token } from "temporaryData/types"
import useNeededAmount from "../../../hooks/useNeededAmount"

const useLevelAccess = (
  type: string,
  amount: number,
  token: Token | undefined,
  stakeToken: Token | undefined,
  chain: number
): [boolean, string] => {
  const tokenBalance = useBalance(token)
  const stakeBalance = useBalance(stakeToken)
  const neededAmount = useNeededAmount(amount, stakeToken)
  const { active, chainId } = useWeb3React()
  const isOnRightChain = typeof chain === "number" && chainId === chain

  if (!active) return [false, "Wallet not connected"]

  if (!isOnRightChain) return [false, "Wrong network"]

  if (type === "HOLD" && amount < 0) return [tokenBalance > 0, ""]

  if (type === "OPEN") return [true, ""]

  if (stakeBalance >= amount) return [true, ""]

  if (tokenBalance < neededAmount) return [false, "Insufficient balance"]

  if (type === "HOLD") return [true, ""]

  return [false, ""]
}

export default useLevelAccess
