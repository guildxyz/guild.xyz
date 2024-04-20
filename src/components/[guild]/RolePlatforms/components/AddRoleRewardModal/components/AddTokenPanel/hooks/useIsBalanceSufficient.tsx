import { Chain } from "@guildxyz/types"
import useTokenBalance from "hooks/useTokenBalance"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { parseUnits } from "viem/utils"
import { useAccount, useBalance } from "wagmi"
import { Chains } from "wagmiConfig/chains"

const useIsBalanceSufficient = ({
  address,
  chain,
  decimals,
  amount,
}: {
  address: `0x${string}`
  chain: Chain
  decimals: number
  amount: number | string
}) => {
  const { chainId, address: userAddress } = useAccount()

  const {
    data: coinBalanceData,
    isLoading: coinBalanceLoading,
    error: coinBalanceError,
  } = useBalance({
    address: userAddress,
  })

  const {
    data: tokenBalanceData,
    isLoading: tokenBalanceLoading,
    error: tokenBalanceError,
  } = useTokenBalance({
    token: address,
    chainId,
    shouldFetch: address !== NULL_ADDRESS,
  })

  const pickedCurrencyIsNative = address === NULL_ADDRESS

  let formattedAmount = BigInt(1)
  try {
    formattedAmount = parseUnits(amount.toString(), decimals)
  } catch {}

  const isOnCorrectChain = Number(Chains[chain]) === chainId
  const error =
    coinBalanceError || tokenBalanceError || !isOnCorrectChain
      ? "Switch chains to check token balance"
      : null

  const isBalanceSufficient = !isOnCorrectChain
    ? null
    : typeof formattedAmount === "bigint" &&
      (pickedCurrencyIsNative
        ? coinBalanceData?.value >= formattedAmount
        : tokenBalanceData?.value >= formattedAmount)

  return {
    isBalanceSufficient,
    error,
    isLoading: coinBalanceLoading || tokenBalanceLoading,
  }
}

export default useIsBalanceSufficient
