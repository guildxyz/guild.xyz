import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import useContract from "hooks/useContract"
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
} => {
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

  return { isAllowanceLoading, allowance, allowanceError, mutateAllowance }
}

export default useAllowance
