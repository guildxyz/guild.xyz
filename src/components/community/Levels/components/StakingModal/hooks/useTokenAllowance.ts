import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useContract from "hooks/useContract"
import ERC20_ABI from "constants/erc20abi.json"
import { useEffect } from "react"
import useSWR from "swr"

const MAX_VALUE = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

const getAllowance = async (_, tokenContract, account, contractAddress) => {
  const allowance = await tokenContract.allowance(account, contractAddress)
  return allowance >= MAX_VALUE / BigInt(4)
}

const useTokenAllowance = (): any => {
  const { account } = useWeb3React()
  const {
    chainData: {
      token: { address: tokenAddress, name },
      contract: { address: contractAddress },
    },
  } = useCommunity()
  const tokenContract = useContract(tokenAddress, ERC20_ABI, true)

  const shouldFetch = typeof account === "string" && !!tokenContract

  const { data } = useSWR(
    shouldFetch
      ? [`${name}_allowance`, tokenContract, account, contractAddress]
      : null,
    getAllowance
  )

  const approve = async () => {
    const tx = await tokenContract.approve(contractAddress, MAX_VALUE)
    return tx
  }
  return [data, approve]
}

export default useTokenAllowance
