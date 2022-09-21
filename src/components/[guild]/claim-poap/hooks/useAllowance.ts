import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import { FEE_COLLECTOR_ADDRESS } from "hooks/useFeeCollectorContract"
import useTokenData from "hooks/useTokenData"
import { useEffect, useState } from "react"
import ERC20_ABI from "static/abis/erc20Abi.json"

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

const useAllowance = (tokenAddress: string, chainId: number) => {
  const { account } = useWeb3React()
  const { data: tokenData, isValidating } = useTokenData(
    Chains[chainId],
    tokenAddress
  )

  const [allowance, setAllowance] = useState<number>()

  useEffect(() => {
    if (
      !tokenAddress ||
      !chainId ||
      tokenAddress === NULL_ADDRESS ||
      !tokenData ||
      isValidating
    )
      return
    ;(async () => {
      const provider = new JsonRpcProvider(RPC[Chains[chainId]]?.rpcUrls?.[0])
      const erc20Contract = new Contract(tokenAddress, ERC20_ABI, provider)

      const fetchedAllowance = await erc20Contract?.allowance(
        account,
        FEE_COLLECTOR_ADDRESS
      )

      const convertedAllowance = +formatUnits(
        fetchedAllowance ?? "0",
        tokenData.decimals ?? 18
      )

      setAllowance(convertedAllowance)
    })()
  }, [tokenAddress, chainId, isValidating, tokenData])

  return allowance
}

export default useAllowance
