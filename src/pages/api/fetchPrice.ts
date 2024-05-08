import { kv } from "@vercel/kv"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { RequirementType } from "requirements"
import { OneOf } from "types"
import {
  ADDRESS_REGEX,
  GUILD_FEE_PERCENTAGE,
  NULL_ADDRESS,
  PURCHASABLE_REQUIREMENT_TYPES,
  TOKEN_BUYER_CONTRACTS,
  ZEROX_API_URLS,
  ZEROX_SUPPORTED_SOURCES,
  ZeroXSupportedSources,
} from "utils/guildCheckout/constants"
import { flipPath } from "utils/guildCheckout/utils"
import { createPublicClient, erc20Abi, formatUnits, http, parseUnits } from "viem"
import { wagmiConfig } from "wagmiConfig"
import { CHAIN_CONFIG, Chain, Chains } from "wagmiConfig/chains"
import { NON_PURCHASABLE_ASSETS_KV_KEY } from "./nonPurchasableAssets"

export type FetchPriceResponse<T extends string | bigint = string> = {
  buyAmount: number
  buyAmountInWei: T // since we can't serialize bigint
  estimatedPriceInSellToken: number
  estimatedPriceInUSD: number
  maxPriceInSellToken: number
  maxPriceInUSD: number
  maxPriceInWei: T // since we can't serialize bigint
  guildBaseFeeInSellToken: number // Base fee (fetched from the TokenBuyer contract)
  estimatedGuildFeeInSellToken: number // Base fee + percentage on the expected price
  estimatedGuildFeeInWei: T // since we can't serialize bigint
  estimatedGuildFeeInUSD: number
  maxGuildFeeInSellToken: number // Base fee + percentage on the max price
  maxGuildFeeInWei: T // since we can't serialize bigint
  maxGuildFeeInUSD: number
  source: ZeroXSupportedSources
  tokenAddressPath: string[]
  path: string
}

type FetchPriceBodyParams = {
  guildId: number
  type: RequirementType
  chain: Chain
  sellToken: string
  address: string
  data: Record<string, any>
}

const getDecimals = async (chain: Chain, tokenAddress: string) => {
  if (tokenAddress === CHAIN_CONFIG[chain].nativeCurrency.symbol)
    return CHAIN_CONFIG[chain].nativeCurrency.decimals

  const publicClient = createPublicClient({
    chain: wagmiConfig.chains.find((c) => Chains[c.id] === chain),
    transport: http(),
  })
  const decimals = await publicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
  })

  return decimals
}

const getGuildFee = async (
  guildId: number,
  sellToken: string,
  chainId: number,
  nativeCurrencyPriceInUSD: number,
  estimatedPriceInSellToken: number,
  estimatedPriceInUSD: number,
  maxPriceInSellToken: number,
  maxPriceInUSD: number,
  sellTokenToEthRate: number
): Promise<{
  guildBaseFeeInSellToken: number
  estimatedGuildFeeInSellToken: number
  estimatedGuildFeeInUSD: number
  maxGuildFeeInSellToken: number
  maxGuildFeeInUSD: number
}> => {
  if (!TOKEN_BUYER_CONTRACTS[Chains[chainId]])
    return Promise.reject("Unsupported chain")

  const publicClient = createPublicClient({
    chain: wagmiConfig.chains.find((c) => c.id === chainId),
    transport: http(),
  })
  const guildBaseFeeInWei = await publicClient.readContract({
    address: TOKEN_BUYER_CONTRACTS[Chains[chainId]].address,
    abi: TOKEN_BUYER_CONTRACTS[Chains[chainId]].abi,
    functionName: "baseFee",
    args: [
      sellToken === CHAIN_CONFIG[Chains[chainId]].nativeCurrency.symbol
        ? NULL_ADDRESS
        : sellToken,
    ],
  })

  const sellTokenDecimals = await getDecimals(Chains[chainId] as Chain, sellToken)

  const guildBaseFeeInSellToken = parseFloat(
    formatUnits(guildBaseFeeInWei as bigint, sellTokenDecimals)
  )
  const guildBaseFeeInUSD =
    (nativeCurrencyPriceInUSD / sellTokenToEthRate) * guildBaseFeeInSellToken

  const estimatedGuildFeeInSellToken =
    estimatedPriceInSellToken * GUILD_FEE_PERCENTAGE + guildBaseFeeInSellToken

  const estimatedGuildFeeInUSD =
    estimatedPriceInUSD * GUILD_FEE_PERCENTAGE + guildBaseFeeInUSD

  const maxGuildFeeInSellToken =
    maxPriceInSellToken * GUILD_FEE_PERCENTAGE + guildBaseFeeInSellToken

  const maxGuildFeeInUSD = maxPriceInUSD * GUILD_FEE_PERCENTAGE + guildBaseFeeInUSD

  return {
    guildBaseFeeInSellToken,
    estimatedGuildFeeInSellToken,
    estimatedGuildFeeInUSD,
    maxGuildFeeInSellToken,
    maxGuildFeeInUSD,
  }
}

const validateParams = (
  obj: Record<string, any>
): OneOf<
  { isValid: boolean; error?: string },
  { isValid: boolean; data: FetchPriceBodyParams }
> => {
  if (!obj)
    return {
      isValid: false,
      error: "You must provide request params.",
    }

  if (!obj.guildId || typeof +obj.guildId !== "number")
    return {
      isValid: false,
      error: "Missing or invalid param: guildId",
    }

  if (
    typeof obj.type !== "string" ||
    !PURCHASABLE_REQUIREMENT_TYPES.includes(obj.type as RequirementType)
  )
    return {
      isValid: false,
      error: `Invalid requirement type: ${obj.type}`,
    }

  if (typeof obj.chain !== "string" || !(obj.chain as Chain))
    return {
      isValid: false,
      error: "Unsupported or invalid chain.",
    }

  if (
    typeof obj.sellToken !== "string" ||
    !(
      ADDRESS_REGEX.test(obj.sellToken) ||
      obj.sellToken === CHAIN_CONFIG[obj.chain].nativeCurrency.symbol
    )
  )
    return {
      isValid: false,
      error: "Invalid sell token address.",
    }

  if (typeof obj.address !== "string" || !ADDRESS_REGEX.test(obj.address))
    return {
      isValid: false,
      error: "Invalid requirement address.",
    }

  if (typeof obj.minAmount !== "undefined" && isNaN(parseFloat(obj.minAmount))) {
    return {
      isValid: false,
      error: "Invalid requirement amount.",
    }
  }

  return {
    isValid: true,
    data: {
      guildId: +obj.guildId,
      type: obj.type as RequirementType,
      chain: obj.chain as Chain,
      sellToken: obj.sellToken,
      address: obj.address,
      data: {
        minAmount: parseFloat(obj.minAmount),
      },
    },
  }
}

export const fetchNativeCurrencyPriceInUSD = async (chain: Chain) =>
  fetch(
    `https://api.coinbase.com/v2/exchange-rates?currency=${CHAIN_CONFIG[chain].nativeCurrency.symbol}`
  )
    .then((coinbaseRes) => coinbaseRes.json())
    .then((coinbaseData) => coinbaseData.data.rates.USD)
    .catch((_) => undefined)

const handler: NextApiHandler<FetchPriceResponse> = async (
  req: NextApiRequest,
  res: NextApiResponse<FetchPriceResponse | { error: string }>
) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ error: `Method ${req.method} is not allowed` })
  }

  const { isValid, error, data: validatedParams } = validateParams(req.query)

  if (!isValid) return res.status(400).json({ error })

  const { guildId, type, chain, sellToken, address, data } = validatedParams
  const minAmount = parseFloat(data.minAmount ?? 1)

  if (type === "ERC20") {
    if (!ZEROX_API_URLS[chain])
      return res.status(400).json({ error: "Unsupported chain" })

    const decimals = await getDecimals(chain, address).catch(() => {
      res.status(500).json({ error: "Couldn't fetch buyToken decimals" })
      return null
    })

    const buyAmountInWei = parseUnits(minAmount.toFixed(decimals), decimals)

    const nativeCurrencyPriceInUSD = await fetchNativeCurrencyPriceInUSD(chain)

    if (typeof nativeCurrencyPriceInUSD === "undefined")
      return res.status(500).json({
        error: `Couldn't fetch ${
          CHAIN_CONFIG[Chains[chain]].nativeCurrency.symbol
        }-USD rate.`,
      })

    const queryParams = new URLSearchParams({
      sellToken,
      buyToken: address,
      buyAmount: buyAmountInWei.toString(),
      includedSources: ZEROX_SUPPORTED_SOURCES.toString(),
    }).toString()

    const response = await fetch(
      `${ZEROX_API_URLS[chain]}/swap/v1/quote?${queryParams}`,
      {
        headers: {
          "0x-api-key": process.env.ZEROX_API_KEY,
        },
      }
    )

    const responseData = await response.json()

    if (response.status !== 200) {
      let errorMessage = response.statusText

      if (responseData.validationErrors?.length) {
        if (
          responseData.validationErrors[0].reason === "INSUFFICIENT_ASSET_LIQUIDITY"
        ) {
          // Set error message and save the token address to the KV store, so we won't try to fetch the price for it anymore
          errorMessage =
            "We are not able to find this token on the market. Contact guild admins for further help."

          await kv.lpush(
            `${NON_PURCHASABLE_ASSETS_KV_KEY}:${Chains[chain]}`,
            address.toLowerCase()
          )
        } else {
          errorMessage = responseData.validationErrors[0].description
        }
      }

      return res.status(response.status).json({
        error: errorMessage,
      })
    }

    const foundSource = responseData.sources.find(
      (source) =>
        ZEROX_SUPPORTED_SOURCES.includes(source.name) && source.proportion === "1"
    )

    const relevantOrder =
      foundSource &&
      responseData.orders.find((order) => order.source === foundSource.name)

    if (!foundSource || !relevantOrder)
      return res.status(500).json({ error: "Couldn't find tokens on Uniswap." })

    const { path: rawPath, uniswapPath, tokenAddressPath } = relevantOrder.fillData
    const path = flipPath(rawPath ?? uniswapPath)

    const estimatedPriceInSellToken = parseFloat(responseData.price) * minAmount
    const maxPriceInSellToken = parseFloat(responseData.guaranteedPrice) * minAmount

    const estimatedPriceInUSD =
      (nativeCurrencyPriceInUSD / responseData.sellTokenToEthRate) *
      estimatedPriceInSellToken
    const maxPriceInUSD =
      (nativeCurrencyPriceInUSD / responseData.sellTokenToEthRate) *
      maxPriceInSellToken

    let guildFeeData
    try {
      guildFeeData = await getGuildFee(
        guildId,
        sellToken,
        Chains[chain],
        nativeCurrencyPriceInUSD,
        estimatedPriceInSellToken,
        estimatedPriceInUSD,
        maxPriceInSellToken,
        maxPriceInUSD,
        responseData.sellTokenToEthRate
      )
    } catch (getGuildFeeError) {
      return res.status(500).json({ error: getGuildFeeError })
    }
    const {
      guildBaseFeeInSellToken,
      estimatedGuildFeeInSellToken,
      estimatedGuildFeeInUSD,
      maxGuildFeeInSellToken,
      maxGuildFeeInUSD,
    } = guildFeeData

    const sellTokenDecimals = await getDecimals(chain, sellToken).catch(() => {
      res.status(500).json({ error: "Couldn't fetch sellToken decimals" })
      return null
    })

    const estimatedGuildFeeInWei = parseUnits(
      estimatedGuildFeeInSellToken.toFixed(sellTokenDecimals),
      sellTokenDecimals
    )

    const maxGuildFeeInWei = parseUnits(
      maxGuildFeeInSellToken.toFixed(sellTokenDecimals),
      sellTokenDecimals
    )

    const source = foundSource.name as ZeroXSupportedSources

    // We're sending this amount to the contract. The unused tokens will be sent back to the user during the transaction.
    const maxPriceInWei =
      ((parseUnits(
        maxPriceInSellToken.toFixed(sellTokenDecimals),
        sellTokenDecimals
      ) -
        BigInt(100000)) /
        BigInt(100000)) *
      BigInt(100000)

    res.setHeader("Cache-Control", "s-maxage=30")
    return res.json({
      buyAmount: minAmount,
      buyAmountInWei: buyAmountInWei.toString(),
      estimatedPriceInSellToken,
      estimatedPriceInUSD,
      maxPriceInSellToken,
      maxPriceInUSD,
      maxPriceInWei: maxPriceInWei.toString(),
      guildBaseFeeInSellToken,
      estimatedGuildFeeInSellToken,
      estimatedGuildFeeInUSD,
      estimatedGuildFeeInWei: estimatedGuildFeeInWei.toString(),
      maxGuildFeeInSellToken,
      maxGuildFeeInUSD,
      maxGuildFeeInWei: maxGuildFeeInWei.toString(),
      source,
      tokenAddressPath,
      path,
    })
  }
  // not sure if we'll ever use this part, so haven't migrated it to viem
  // else if (type === "ERC721" || type === "ERC1155") {
  //   if (!RESERVOIR_API_URLS[chain])
  //     return res.status(400).json({ error: "Unsupported chain" })

  //   const queryParams: {
  //     limit: string
  //     collection?: string
  //     attributes?: string
  //     tokens?: string
  //     [x: string]: string
  //   } = {
  //     collection: address,
  //     limit: minAmount.toString(),
  //   }

  //   if (data?.attributes?.length) {
  //     data.attributes.forEach(
  //       (attr) =>
  //         (queryParams[`attributes[${attr.trait_type}]`] = capitalize(attr.value))
  //     )
  //   } else if (data?.id?.length) {
  //     delete queryParams.collection
  //     queryParams.tokens = `${address}:${data.id}`
  //   }

  //   const urlSearchParams = new URLSearchParams(queryParams).toString()

  //   const response = await fetch(
  //     `${RESERVOIR_API_URLS[chain]}/tokens/v5?${urlSearchParams}`
  //   )

  //   if (response.status !== 200)
  //     return res.status(response.status).json({ error: response.statusText })

  //   const responseData = await response.json()

  //   if (
  //     !responseData.tokens?.length ||
  //     responseData.tokens.length < minAmount ||
  //     !responseData.tokens.every((t) => !!t.market.floorAsk.price)
  //   )
  //     return res.status(500).json({ error: "Couldn't find purchasable NFTs." })

  //   const nativeCurrencyPriceInUSD = await fetchNativeCurrencyPriceInUSD(chain)

  //   if (typeof nativeCurrencyPriceInUSD === "undefined")
  //     return res.status(500).json({
  //       error: `Couldn't fetch ${RPC[chain].nativeCurrency.symbol}-USD rate.`,
  //     })

  //   // sellToken is always nativeCurrency here (at least for now)
  //   // TODO: maybe we don't need map here? And the user will be able to buy only one token at a time?
  //   const maxPriceInSellToken = responseData.tokens
  //     .map((t) => t.market.floorAsk.price.amount.native)
  //     .reduce((p1, p2) => p1 + p2, 0)

  //   const maxPriceInUSD = responseData.tokens
  //     .map((t) => t.market.floorAsk.price.amount.usd)
  //     .reduce((p1, p2) => p1 + p2, 0)

  //   const maxPriceInWei = parseUnits(
  //     maxPriceInSellToken.toString(),
  //     RPC[chain].nativeCurrency.decimals
  //   )

  //   let guildFeeData
  //   try {
  //     // TODO: fix this once we support NFT purchases
  //     guildFeeData = await getGuildFee(
  //       guildId,
  //       sellToken,
  //       Chains[chain],
  //       nativeCurrencyPriceInUSD,
  //       0,
  //       0,
  //       maxPriceInSellToken,
  //       maxPriceInUSD,
  //       1
  //     )
  //   } catch (getGuildFeeError) {
  //     return res.status(500).json({ error: getGuildFeeError })
  //   }

  //   const {
  //     guildBaseFeeInSellToken,
  //     estimatedGuildFeeInSellToken,
  //     estimatedGuildFeeInUSD,
  //     maxGuildFeeInSellToken,
  //     maxGuildFeeInUSD,
  //   } = guildFeeData

  //   const estimatedGuildFeeInWei = parseUnits(
  //     estimatedGuildFeeInSellToken.toString(),
  //     RPC[chain].nativeCurrency.decimals
  //   )

  //   const maxGuildFeeInWei = parseUnits(
  //     maxGuildFeeInSellToken.toString(),
  //     RPC[chain].nativeCurrency.decimals
  //   )

  //   const source = responseData.tokens[0].market.floorAsk.source.name

  //   return res.json({
  //     buyAmount: minAmount,
  //     buyAmountInWei: BigNumber.from(0), // TODO
  //     estimatedPriceInSellToken: 0, // TODO
  //     estimatedPriceInUSD: 0, // TODO
  //     maxPriceInSellToken,
  //     maxPriceInUSD,
  //     maxPriceInWei,
  //     guildBaseFeeInSellToken,
  //     estimatedGuildFeeInSellToken,
  //     estimatedGuildFeeInUSD,
  //     estimatedGuildFeeInWei,
  //     maxGuildFeeInSellToken,
  //     maxGuildFeeInUSD,
  //     maxGuildFeeInWei,
  //     source, // TODO
  //     tokenAddressPath: [], // TODO
  //     path: "", // TODO
  //   })
  // }

  res.json(undefined)
}

export default handler
