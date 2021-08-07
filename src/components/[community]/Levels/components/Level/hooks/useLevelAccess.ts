import { useWeb3React } from "@web3-react/core"
import useBalance from "hooks/useBalance"
import useMutagenNfts from "hooks/useMutagenNfts"
import { RequirementType, Token } from "temporaryData/types"
import useNeededAmount from "../../../hooks/useNeededAmount"

const useLevelAccess = (
  type: RequirementType,
  requirement: number,
  token: Token | undefined,
  stakeToken: Token | undefined,
  chain: number
): [boolean, string] => {
  const tokenBalance = useBalance(token)
  const stakeBalance = useBalance(stakeToken)
  const ownedNfts = useMutagenNfts(type, token)
  const neededAmount = useNeededAmount(requirement, stakeToken)
  const { active, chainId } = useWeb3React()
  const isOnRightChain = typeof chain === "number" && chainId === chain

  if (!active) return [false, "Wallet not connected"]

  if (!isOnRightChain) return [false, "Wrong network"]

  if (type === "HOLD" && requirement < 0) return [tokenBalance > 0, ""]

  if (type === "OPEN") return [true, ""]

  if (stakeBalance >= requirement) return [true, ""]

  if (tokenBalance < neededAmount) return [false, "Insufficient balance"]

  if (type === "HOLD") return [true, ""]

  if (type === "NFT_HOLD")
    return ownedNfts?.includes(requirement) ? [true, ""] : [false, "NFT not owned"]

  return [false, ""]
}

export default useLevelAccess
