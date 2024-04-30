import { kv } from "@vercel/kv"
import { ContractCallSupportedChain } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import { NextApiHandler } from "next"
import { OneOf } from "types"
import fetcher from "utils/fetcher"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import { Chain } from "wagmiConfig/chains"

type Owner = {
  ownerAddress: string
  tokenBalances: { tokenId: string; balance: string }[]
}

export type TopCollectorsResponse = OneOf<
  {
    uniqueCollectors: number
    topCollectors: string[]
  },
  { error: string }
>

export const alchemyApiUrl: Record<ContractCallSupportedChain, string> = {
  POLYGON: `https://polygon-mainnet.g.alchemy.com/nft/v3/${process.env.POLYGON_ALCHEMY_KEY}/getOwnersForContract`,
  BASE_MAINNET: `https://base-mainnet.g.alchemy.com/nft/v3/${process.env.BASE_ALCHEMY_KEY}/getOwnersForContract`,
  ETHEREUM: `https://eth-mainnet.g.alchemy.com/nft/v3/${process.env.MAINNET_ALCHEMY_KEY}/getOwnersForContract`,
  OPTIMISM: `https://opt-mainnet.g.alchemy.com/nft/v3/${process.env.OPTIMISM_ALCHEMY_KEY}/getOwnersForContract`,
  BSC: "",
  CRONOS: "",
  MANTLE: "",
  ZKSYNC_ERA: "",
  LINEA: "",
  SEPOLIA: "",
}

export const validateNftChain = (value: string | string[]): Chain => {
  const valueAsString = value?.toString()?.toUpperCase()
  if (!value || !Object.keys(alchemyApiUrl).includes(valueAsString)) return null
  return valueAsString as Chain
}
export const validateNftAddress = (value: string | string[]): `0x${string}` => {
  const valueAsString = value?.toString()
  if (!ADDRESS_REGEX.test(valueAsString)) return null
  return valueAsString.toLowerCase() as `0x${string}`
}

const handler: NextApiHandler<TopCollectorsResponse> = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ error: `Method ${req.method} is not allowed` })
  }

  const { chain: chainFromQuery, address: addressFromQuery } = req.query

  const chain = validateNftChain(chainFromQuery)
  const address = validateNftAddress(addressFromQuery)

  if (!chain || !address)
    return res.status(400).json({ error: "Invalid chain or address" })

  if (!alchemyApiUrl[chain]) {
    res.json({
      topCollectors: [],
      uniqueCollectors: 0,
    })
    return
  }

  const kvKey = `nftCollectors:${chain}:${address.toLowerCase()}`
  const cachedResponse: TopCollectorsResponse = await kv.get(kvKey)

  if (cachedResponse) {
    // Cache the response for 5 minutes, so if the user refreshes the page, we don't need to fetch it from KV again, just send back the latest response
    res.setHeader("Cache-Control", "s-maxage=300")
    return res.json(cachedResponse)
  }

  let pageKey: string
  const owners: Owner[] = []
  const searchParamsObject = {
    contractAddress: address,
    withTokenBalances: "true",
    pageKey: "",
  }
  const searchParams = new URLSearchParams(searchParamsObject)

  do {
    try {
      const newOwners: { owners?: Owner[]; pageKey?: string } = await fetcher(
        `${alchemyApiUrl[chain]}?${searchParams.toString()}`
      )

      if (newOwners.owners?.length) owners.push(...newOwners.owners)

      pageKey = newOwners.pageKey
      if (pageKey) searchParams.set("pageKey", pageKey)
    } catch (alchemyApiError) {
      return res.status(500).json({ error: "Couldn't fetch NFT owners" })
    }
  } while (pageKey)

  const ownersWithBalances: { ownerAddress: string; tokenBalance: number }[] =
    owners.map(({ ownerAddress, tokenBalances }) => {
      let tokenBalance = 0
      for (const token of tokenBalances) {
        tokenBalance += Number(token.balance)
      }

      return {
        ownerAddress,
        tokenBalance,
      }
    })
  const sortedOwners = ownersWithBalances.sort(
    (ownerA, ownerB) => ownerB.tokenBalance - ownerA.tokenBalance
  )

  const response: TopCollectorsResponse = {
    topCollectors: sortedOwners
      .slice(0, 100)
      .map(({ ownerAddress }) => ownerAddress),
    uniqueCollectors: owners.length,
  }

  // Store in cache for 30 minutes
  await kv.set(kvKey, response, { ex: 60 * 30 })

  res.setHeader("Cache-Control", "s-maxage=300")
  res.json(response)
}

export default handler
