import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import parseBalance from "utils/parseBalance"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import { Token } from "temporaryData/types"
import useERC20Contract from "hooks/useERC20Contract"
import { Contract } from "@ethersproject/contracts"

const getBalance = async (_: string, address: string, tokenContract: Contract) =>
  tokenContract.balanceOf(address).then((balance) => parseBalance(balance))

const useBalance = (token: Token) => {
  const { library, chainId, account } = useWeb3React()
  const tokenContract = useERC20Contract(token.address)

  const shouldFetch = typeof account === "string" && !!library

  const result = useSWR(
    shouldFetch ? [`${token.name}_balance`, account, tokenContract, chainId] : null,
    getBalance
  )

  useKeepSWRDataLiveAsBlocksArrive(result.mutate)

  return result
}

export default useBalance
