import { Contract } from "@ethersproject/contracts"
import { JsonRpcBatchProvider } from "@ethersproject/providers"
import { Chain, Chains, RPC } from "connectors"
import ERC721_ABI from "static/abis/erc721Abi.json"
import useSWRImmutable from "swr/immutable"

type NFTDetails = {
  creator: string
  totalMinters: number
  uniqueMinters: number
}

const fetchNFTDetails = async ([, chain, address]): Promise<NFTDetails> => {
  const provider = new JsonRpcBatchProvider(RPC[chain].rpcUrls[0], Chains[chain])
  const contract = new Contract(address, ERC721_ABI, provider)

  try {
    const [owner, totalSupply] = await Promise.all([
      contract.owner(),
      contract.totalSupply(),
    ])

    const totalSupplyAsNumber = totalSupply ? totalSupply.toNumber() : 0

    return {
      creator: owner?.toLowerCase(),
      totalMinters: totalSupplyAsNumber,
      // TODO
      uniqueMinters: totalSupplyAsNumber,
    }
  } catch (err) {
    return {
      creator: undefined,
      totalMinters: undefined,
      uniqueMinters: undefined,
    }
  }
}

const useNftDetails = (chain: Chain, address: string) => {
  const shouldFetch = Boolean(chain && address)

  return useSWRImmutable<NFTDetails>(
    shouldFetch ? ["nftDetails", chain, address] : null,
    fetchNFTDetails
  )
}

export default useNftDetails
