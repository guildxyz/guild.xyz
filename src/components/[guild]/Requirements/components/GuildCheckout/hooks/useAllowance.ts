import { Chains } from "chains"
import useShowErrorToast from "hooks/useShowErrorToast"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { maxUint256 } from "viem"
import {
  erc20ABI,
  useAccount,
  useChainId,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
} from "wagmi"
import { useRequirementContext } from "../../RequirementContext"

const useAllowance = (tokenAddress: `0x${string}`, contract: `0x${string}`) => {
  const showErrorToast = useShowErrorToast()

  const { address } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()

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

  const { config } = usePrepareContractWrite({
    abi: erc20ABI,
    address: tokenAddress,
    functionName: "approve",
    args: [contract, maxUint256],
    enabled,
  })

  const { isLoading: isAllowing, write: allowSpendingTokens } = useContractWrite({
    ...config,
    onError: (err: any) => showErrorToast(err?.shortMessage ?? err),
    onSuccess: async ({ hash }) => {
      await publicClient.waitForTransactionReceipt({ hash })
      refetch()
    },
  })

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
