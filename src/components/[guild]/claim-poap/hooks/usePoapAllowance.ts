import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import { FEE_COLLECTOR_ADDRESS } from "hooks/useFeeCollectorContract"
import { useEffect, useState } from "react"
import ERC20_ABI from "static/abis/erc20Abi.json"

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

const usePoapAllowance = (tokenAddress: string, chainId: number): BigNumber => {
  const { account } = useWeb3React()

  const [allowance, setAllowance] = useState<BigNumber>()

  useEffect(() => {
    if (!tokenAddress || !chainId || tokenAddress === NULL_ADDRESS) return
    ;(async () => {
      const provider = new JsonRpcProvider(RPC[Chains[chainId]]?.rpcUrls?.[0])
      const erc20Contract = new Contract(tokenAddress, ERC20_ABI, provider)

      const fetchedAllowance = await erc20Contract?.allowance(
        account,
        FEE_COLLECTOR_ADDRESS
      )

      setAllowance(fetchedAllowance)
    })()
  }, [tokenAddress, chainId])

  return allowance
}

export default usePoapAllowance
