import useTokenBalance from "hooks/useTokenBalance"
import useTokenData from "hooks/useTokenData"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { parseUnits } from "viem/utils"
import { useAccount, useBalance } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"

const useIsBalanceSufficient = ({
  address,
  chain,
  amount,
}: {
  address: `0x${string}`
  chain: Chain
  amount: number | string
}) => {
  const { chainId, address: userAddress } = useAccount()
  const {
    data: { decimals },
  } = useTokenData(chain, address)

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
  const formattedAmount =
    !!amount && decimals ? parseUnits(amount.toString(), decimals) : BigInt(1)

  const isOnCorrectChain = Number(Chains[chain]) === chainId
  const error =
    coinBalanceError || tokenBalanceError || !isOnCorrectChain
      ? "Switch chains to check token balance"
      : null

  const isBalanceSufficient = !isOnCorrectChain
    ? false
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
