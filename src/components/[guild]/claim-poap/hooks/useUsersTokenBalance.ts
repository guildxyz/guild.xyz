import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import ERC20_ABI from "static/abis/erc20Abi.json"
import useSWRImmutable from "swr/immutable"

const fetchBalance = async (_: string, account: string, contract: Contract) =>
  contract.balanceOf(account)

const useUsersTokenBalance = (
  tokenAddress: string
): { balance: any; isBalanceLoading: boolean } => {
  const { account } = useWeb3React()
  const contract = useContract(tokenAddress, ERC20_ABI)
  const shouldFetch = account && tokenAddress && contract

  const { data: balance, isValidating: isBalanceLoading } = useSWRImmutable(
    shouldFetch ? ["usersTokenBalance", account, contract] : null,
    fetchBalance
  )

  return { balance, isBalanceLoading }
}

export default useUsersTokenBalance
