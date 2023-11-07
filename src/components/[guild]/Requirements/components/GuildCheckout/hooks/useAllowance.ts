import { Chains } from "chains"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { maxUint256 } from "viem"
import { erc20ABI, useAccount, useChainId, useContractRead } from "wagmi"
import { useRequirementContext } from "../../RequirementContext"

const useAllowance = (tokenAddress: `0x${string}`, contract: `0x${string}`) => {
  const showErrorToast = useShowErrorToast()

  const { address } = useAccount()
  const chainId = useChainId()

  const requirement = useRequirementContext()

  const enabled = Boolean(
    tokenAddress &&
      requirement?.chain === Chains[chainId] &&
      tokenAddress !== NULL_ADDRESS
  )

  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    error: allowanceError,
    refetch,
  } = useContractRead({
    abi: erc20ABI,
    address: tokenAddress,
    functionName: "allowance",
    args: [address, contract],
    enabled,
  })

  const { isLoading: isAllowing, onSubmitTransaction: allowSpendingTokens } =
    useSubmitTransaction(
      {
        abi: erc20ABI,
        address: tokenAddress,
        functionName: "approve",
        args: [contract, maxUint256],
        enabled,
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
