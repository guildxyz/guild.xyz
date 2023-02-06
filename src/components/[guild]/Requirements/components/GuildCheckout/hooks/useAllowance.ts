import { BigNumber } from "@ethersproject/bignumber"
import { MaxUint256 } from "@ethersproject/constants"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import useContract from "hooks/useContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import ERC20_ABI from "static/abis/erc20Abi.json"
import useSWR, { KeyedMutator } from "swr"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"

const fetchAllowance = (
  _: string,
  account: string,
  contract: Contract,
  contractAddress: string
) => contract?.allowance(account, contractAddress)

const useAllowance = (
  tokenAddress: string,
  contract: string
): {
  isAllowanceLoading: boolean
  allowance: BigNumber
  allowanceError: any
  mutateAllowance: KeyedMutator<any>
  onSubmit: () => void
  response: any
  isLoading: boolean
  error: any
  reset: () => void
} => {
  const showErrorToast = useShowErrorToast()

  const { account, chainId } = useWeb3React()
  const erc20Contract = useContract(tokenAddress, ERC20_ABI, true)

  const { requirement } = useGuildCheckoutContext()

  const shouldFetch =
    tokenAddress &&
    erc20Contract &&
    requirement?.chain === Chains[chainId] &&
    tokenAddress !== RPC[requirement?.chain]?.nativeCurrency?.symbol

  const {
    data: allowance,
    isValidating: isAllowanceLoading,
    error: allowanceError,
    mutate: mutateAllowance,
  } = useSWR(
    shouldFetch ? ["allowance", account, erc20Contract, contract] : null,
    fetchAllowance
  )

  const allowSpendingTokensCall = async () => {
    const approveRes = await erc20Contract?.approve(contract, MaxUint256)
    const approved = await approveRes?.wait()
    return approved
  }

  const useSubmitData = useSubmit(allowSpendingTokensCall, {
    onError: (error) => showErrorToast(error?.code ?? error),
    onSuccess: () => mutateAllowance(),
  })

  return {
    isAllowanceLoading,
    allowance,
    allowanceError,
    mutateAllowance,
    ...useSubmitData,
  }
}

export default useAllowance
