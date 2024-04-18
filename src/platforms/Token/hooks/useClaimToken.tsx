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

const useTokenClaimFee = (
  chain: Chain,
  roleId?: number,
  rolePlatformId?: number
) => {
  const feeTransactionConfig = {
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACTS[chain],
    functionName: "fee",
    chainId: Chains[chain],
  } as const
  const {
    data: fee,
    isLoading: isFeeLoading,
    error,
  } = useReadContract(feeTransactionConfig)
  return { fee, isFeeLoading, error }
}

export default useTokenClaimFee
