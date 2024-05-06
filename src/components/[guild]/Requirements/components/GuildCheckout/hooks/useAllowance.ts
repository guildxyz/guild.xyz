import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { erc20Abi, maxUint256 } from "viem"
import { useAccount, useReadContract } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { useRequirementContext } from "../../RequirementContext"

const useAllowance = (tokenAddress: `0x${string}`, contract: `0x${string}`) => {
  const showErrorToast = useShowErrorToast()

  const { address, chainId } = useAccount()

  const requirement = useRequirementContext()

  const enabled = Boolean(
    tokenAddress &&
      (!requirement || requirement?.chain === Chains[chainId]) &&
      tokenAddress !== NULL_ADDRESS
  )

  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    error: allowanceError,
    refetch,
  } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [address, contract],
    query: {
      enabled,
    },
  })

  const { isLoading: isAllowing, onSubmitTransaction: allowSpendingTokens } =
    useSubmitTransaction(
      {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "approve",
        args: [contract, maxUint256],
        query: {
          enabled,
        },
      },
      {
        setContext: false,
        onError: (error) => showErrorToast(error),
        onSuccess: () => refetch(),
      }
    )

  return {
    isAllowanceLoading,
    isAllowing,
    allowance,
    allowanceError,
    refetch,
    allowSpendingTokens,
  }
}

export default useAllowance
