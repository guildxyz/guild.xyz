import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import ERC20_ABI from "constants/erc20abi.json"
import useContract from "hooks/useContract"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import useSWR from "swr"
import type { Token } from "temporaryData/types"

const getBalance = async (
  _: string,
  address: string,
  tokenContract: Contract,
  decimals: number
): Promise<number> =>
  tokenContract &&
  tokenContract.balanceOf(address).then((balance) => formatUnits(balance, decimals))

const useBalance = (token: Token): number => {
  const { library, chainId, account } = useWeb3React<Web3Provider>()
  const tokenContract = useContract(token?.address, ERC20_ABI)

  const shouldFetch =
    typeof account === "string" && !!library && typeof token?.address === "string"

  const { data, mutate } = useSWR(
    shouldFetch
      ? [`${token?.name}_balance`, account, tokenContract, token.decimals, chainId]
      : null,
    getBalance,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    }
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useBalance
