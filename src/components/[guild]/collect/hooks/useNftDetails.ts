import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcBatchProvider } from "@ethersproject/providers"
import { Chain, Chains, RPC } from "connectors"
import GUILD_REWARD_NFT_ABI from "static/abis/guildRewardNft.json"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { getBlockByTime } from "utils/getBlockByTime"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"

type NftStandard = "ERC-721" | "ERC-1155" | "Unknown"

enum ContractInterface {
  "ERC721" = "0x80ac58cd",
  "ERC1155" = "0xd9b67a26",
}

type NFTDetails = {
  creator: string
  name: string
  totalCollectors: number
  totalCollectorsToday?: number
  standard: NftStandard
  image?: string
  description?: string
  fee: BigNumber
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
  const contract = new Contract(address, GUILD_REWARD_NFT_ABI, provider)

  let firstTotalSupplyToday
  if (!isNaN(Number(firstBlockNumberToday?.result))) {
    try {
      firstTotalSupplyToday = await contract.totalSupply({
        blockTag: Number(firstBlockNumberToday.result),
      })
    } catch {
      firstTotalSupplyToday = BigNumber.from(0)
    }
  }

  try {
    const [owner, name, totalSupply, isERC721, isERC1155, tokenURI, fee] =
      await Promise.all([
        contract.owner(),
        contract.name(),
        contract.totalSupply(),
        contract.supportsInterface(ContractInterface.ERC721),
        contract.supportsInterface(ContractInterface.ERC1155),
        contract.tokenURI(0).catch(() => ""),
        contract.fee(NULL_ADDRESS),
      ])

    const totalSupplyAsNumber = BigNumber.isBigNumber(totalSupply)
      ? totalSupply.toNumber()
      : 0
    const firstTotalSupplyTodayAsNumber = BigNumber.isBigNumber(
      firstTotalSupplyToday
    )
      ? firstTotalSupplyToday.toNumber()
      : undefined

    let image = ""
    let description = ""

    if (tokenURI) {
      const metadata = await fetcher(
        tokenURI.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_GATEWAY)
      ).catch(() => null)
      description = metadata?.description
      image = metadata?.image?.replace(
        "ipfs://",
        process.env.NEXT_PUBLIC_IPFS_GATEWAY
      )
    }

    return {
      creator: owner?.toLowerCase(),
      name,
      totalCollectors: totalSupplyAsNumber,
      totalCollectorsToday: firstTotalSupplyTodayAsNumber
        ? totalSupplyAsNumber - firstTotalSupplyToday
        : 0,
      standard: isERC1155 ? "ERC-1155" : isERC721 ? "ERC-721" : "Unknown",
      image,
      description,
      fee,
    }
  } catch {
    return {
      creator: undefined,
      name: undefined,
      totalCollectors: undefined,
      totalCollectorsToday: undefined,
      standard: undefined,
      image: undefined,
      description: undefined,
      fee: undefined,
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
