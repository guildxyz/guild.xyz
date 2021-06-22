import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import parseBalance from "utils/parseBalance"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import { Token } from "temporaryData/types"
import useContract from "hooks/useContract"
import { Contract } from "@ethersproject/contracts"
import ERC20_ABI from "constants/erc20abi.json"

const getBalance = async (_: string, address: string, tokenContract: Contract) =>
  tokenContract.balanceOf(address).then((balance) => parseBalance(balance))

const useBalance = (token: Token) => {
  const { library, chainId, account } = useWeb3React()
  const tokenContract = useContract(token.address, ERC20_ABI)

  const shouldFetch = typeof account === "string" && !!library

  const result = useSWR(
    shouldFetch ? [`${token.name}_balance`, account, tokenContract, chainId] : null,
    getBalance
  )

  useKeepSWRDataLiveAsBlocksArrive(result.mutate)

  return result
}

export default useBalance
