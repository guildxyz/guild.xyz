import { NextApiHandler } from "next"
import guildRewardNftAbi from "static/abis/guildRewardNft"
import { OneOf } from "types"
import { createPublicClient } from "viem"
import { wagmiConfig } from "wagmiConfig"
import { Chains } from "wagmiConfig/chains"
import {
  validateNftAddress,
  validateNftChain,
} from "../collectors/[chain]/[address]"

type NftStandard = "ERC-721" | "ERC-1155" | "Unknown"
enum ContractInterface {
  "ERC721" = "0x80ac58cd",
  "ERC1155" = "0xd9b67a26",
}

export type NFTDetails = {
  creator: string
  name: string
  totalCollectors: number
  totalCollectorsToday?: number
  standard: NftStandard
  image?: string
  description?: string
  fee: bigint
}

// Only returning data which we can cache infinitely, so we don't need to refetch it if the metadata/totalSupply changes
export type NFTDetailsAPIResponse = OneOf<
  Omit<
    NFTDetails,
    "totalCollectors" | "totalCollectorsToday" | "description" | "image" | "fee"
  >,
  { error: string }
>

const handler: NextApiHandler<NFTDetailsAPIResponse> = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ error: `Method ${req.method} is not allowed` })
  }

  const { chain: queryChain, address: queryAddress } = req.query
  const chain = validateNftChain(queryChain)
  const address = validateNftAddress(queryAddress)

  if (!chain || !address) {
    res.status(400).json({
      error: "Invalid query parameters",
    })
    return
  }

  const chainFromConfig = wagmiConfig.chains.find((c) => c.id === Chains[chain])

  if (!chainFromConfig) {
    res.status(400).json({
      error: "Unsupported chain",
    })
    return
  }

  const client = createPublicClient({
    chain: chainFromConfig,
    transport: wagmiConfig._internal.transports[chainFromConfig.id],
  })

  const contract = {
    address,
    abi: guildRewardNftAbi,
    chainId: chainFromConfig.id,
  } as const

  const data = await client.multicall({
    /**
     * We need to @ts-ignore this line, since we get a "Type instantiation is
     * excessively deep and possibly infinite" error here until strictNullChecks is
     * set to false in our tsconfig. We should set it to true & sort out the related
     * issues in another PR.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    contracts: [
      {
        ...contract,
        functionName: "owner",
      },
      {
        ...contract,
        functionName: "name",
      },
      {
        ...contract,
        functionName: "supportsInterface",
        args: [ContractInterface.ERC1155],
      },
    ],
  })

  if (data.some((r) => r.status === "failure")) {
    res.status(500).json({
      error: "Couldn't fetch NFT details",
    })
    return
  }

  const [ownerResponse, nameResponse, supportsInterfaceResponse] = data || []

  const creator = ownerResponse?.result
  const name = nameResponse?.result
  const isERC1155 = supportsInterfaceResponse?.result

  // Caching for a year, because on-chain data won't change
  res.setHeader("Cache-Control", "s-maxage=31536000")
  res.json({
    creator,
    name,
    standard: isERC1155 ? "ERC-1155" : "ERC-721",
  })
}

export default handler
