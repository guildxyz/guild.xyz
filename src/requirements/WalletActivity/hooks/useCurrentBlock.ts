import { JsonRpcProvider } from "@ethersproject/providers"
import { Chain, Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"

const getCurrentBlock = async (_: string, chain: Chain) => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0], Chains[chain])
  return provider.getBlockNumber()
}

const useCurrentBlock = (chain: Chain) =>
  useSWRImmutable(chain ? ["currentBlock", chain] : null, getCurrentBlock)

export default useCurrentBlock
