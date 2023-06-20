import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcBatchProvider } from "@ethersproject/providers"
import { Chain, Chains, RPC } from "connectors"
import { getBlockByTime } from "requirements/WalletActivity/hooks/useBlockNumberByTimestamp"
import ERC721_ABI from "static/abis/erc721Abi.json"
import useSWRImmutable from "swr/immutable"

type NFTDetails = {
  creator: string
  totalMinters: number
  totalMintersToday?: number
}

const fetchNFTDetails = async ([, chain, address]): Promise<NFTDetails> => {
  const currentDate = new Date()
  currentDate.setUTCHours(0, 0, 0, 0)
  const noonUnixTimestamp = currentDate.getTime() / 1000

  let firstBlockNumberToday

  try {
    firstBlockNumberToday = await getBlockByTime([
      undefined,
      chain,
      noonUnixTimestamp,
    ])
  } catch {}

  const provider = new JsonRpcBatchProvider(RPC[chain].rpcUrls[0], Chains[chain])
  const contract = new Contract(address, ERC721_ABI, provider)

  let firstTotalSupplyToday
  if (!isNaN(Number(firstBlockNumberToday?.result))) {
    firstTotalSupplyToday = await contract.totalSupply({
      blockTag: Number(firstBlockNumberToday.result),
    })
  }

  try {
    const [owner, totalSupply] = await Promise.all([
      contract.owner(),
      contract.totalSupply(),
    ])

    const totalSupplyAsNumber = BigNumber.isBigNumber(totalSupply)
      ? totalSupply.toNumber()
      : 0
    const firstTotalSupplyTodayAsNumber = BigNumber.isBigNumber(
      firstTotalSupplyToday
    )
      ? firstTotalSupplyToday.toNumber()
      : undefined

    return {
      creator: owner?.toLowerCase(),
      totalMinters: totalSupplyAsNumber,
      totalMintersToday: firstTotalSupplyTodayAsNumber
        ? totalSupplyAsNumber - firstTotalSupplyToday
        : undefined,
    }
  } catch (err) {
    return {
      creator: undefined,
      totalMinters: undefined,
      totalMintersToday: undefined,
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
