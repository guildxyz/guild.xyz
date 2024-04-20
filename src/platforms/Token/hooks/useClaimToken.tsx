import { Chain } from "@guildxyz/types"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import { useReadContract } from "wagmi"
import { Chains } from "wagmiConfig/chains"

type ClaimResponse = {
  amount: string
  poolId: number
  rolePlatfromId: number
  signature: string
  signedAt: number
  userId: number
}

const useTokenClaimFee = (chain: Chain) => {
  const feeTransactionConfig = {
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACTS[chain],
    functionName: "fee",
    chainId: Chains[chain],
  } as const
  const { data: amount, isLoading, error } = useReadContract(feeTransactionConfig)
  return { amount, isLoading, error }
}

export default useTokenClaimFee
