import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { parseUnits } from "@ethersproject/units"
import { Chain, Chains, RPC } from "connectors"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { RequirementType } from "requirements"
import ERC20_ABI from "static/abis/erc20Abi.json"
import capitalize from "utils/capitalize"
import {
  GUILD_FEE_FIXED_USD,
  GUILD_FEE_PERCENTAGE,
  PURCHASABLE_REQUIREMENT_TYPES,
  RESERVOIR_API_URLS,
  ZEROX_API_URLS,
  ZEROX_EXCLUDED_SOURCES,
} from "utils/guildCheckout/constants"

export type SupportedSources = "Uniswap_V2" | "Uniswap_V3"

export type FetchPriceResponse = {
  buyAmount: number
  price: number
  priceInUSD: number
  gasFee: number
  gasFeeInUSD: number
  guildFee: number
  guildFeeInUSD: number
  source: SupportedSources
  tokenAddressPath: string[]
  path: string
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const validateBody = (
  obj: Record<string, any>
): { isValid: boolean; error?: string } => {
  if (!obj)
    return {
      isValid: false,
      error: "You must provide a request body.",
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
    typeof obj.sellAddress !== "string" ||
    !(
      ADDRESS_REGEX.test(obj.sellAddress) ||
      obj.sellAddress === RPC[obj.chain].nativeCurrency.symbol
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

  if (
    typeof obj.data?.minAmount !== "undefined" &&
    isNaN(parseFloat(obj.data?.minAmount))
  )
    return {
      isValid: false,
      error: "Invalid requirement amount.",
    }

  return { isValid: true }
}

const fetchNativeCurrencyPrice = async (chain: Chain) =>
  fetch(
    `https://api.coinbase.com/v2/exchange-rates?currency=${RPC[chain].nativeCurrency.symbol}`
  )
    .then((coinbaseRes) => coinbaseRes.json())
    .then((coinbaseData) => coinbaseData.data.rates.USD)
    .catch((_) => undefined)

const handler: NextApiHandler<FetchPriceResponse> = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: `Method ${req.method} is not allowed` })
  }

  const { isValid, error } = validateBody(req.body)

  if (!isValid) return res.status(400).json({ error })

  const { type: rawType, chain: rawChain, sellAddress, address, data } = req.body
  const type = rawType as RequirementType
  const chain = rawChain as Chain
  const minAmount = parseFloat(data.minAmount ?? 1)

  if (type === "ERC20") {
    if (!ZEROX_API_URLS[chain])
      return res.status(400).json({ error: "Unsupported chain" })

    const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0], Chains[chain])
    const tokenContract = new Contract(address, ERC20_ABI, provider)
    let decimals

    try {
      decimals = await tokenContract.decimals()
    } catch (_) {}

    if (!decimals)
      return res.status(500).json({ error: "Couldn't fetch buyToken decimals." })

    const formattedBuyAmount = parseUnits(minAmount.toString(), decimals).toString()

    const nativeCurrencyPrice = await fetchNativeCurrencyPrice(chain)

    if (typeof nativeCurrencyPrice === "undefined")
      return res.status(500).json({
        error: `Couldn't fetch ${
          RPC[Chains[chain]].nativeCurrency.symbol
        }-USD rate.`,
      })

    const queryParams = new URLSearchParams({
      sellToken: sellAddress,
      buyToken: address,
      buyAmount: formattedBuyAmount,
      excludedSources: ZEROX_EXCLUDED_SOURCES.toString(),
    }).toString()

    const response = await fetch(
      `${ZEROX_API_URLS[chain]}/swap/v1/quote?${queryParams}`
    )

    const responseData = await response.json()

    if (response.status !== 200) {
      return res.status(response.status).json({
        error: responseData.validationErrors?.length
          ? responseData.validationErrors[0].description
          : response.statusText,
      })
    }

    // We support Uniswap V2 and V3 for now
    const foundSource = responseData.sources.find(
      (source) =>
        (source.name === "Uniswap_V2" || source.name === "Uniswap_V3") &&
        source.proportion === "1"
    )

    const relevantOrder =
      foundSource &&
      responseData.orders.find((order) => order.source === foundSource.name)

    if (!foundSource || !relevantOrder)
      return res.status(500).json({ error: "Couldn't find tokens on Uniswap." })

    const path = relevantOrder.fillData.uniswapPath
    const tokenAddressPath = relevantOrder.fillData.tokenAddressPath

    // TODO: error if we can't fetch path/tokenAddressPath?

    const price = parseFloat(responseData.guaranteedPrice) * minAmount
    const priceInUSD = parseFloat(
      ((nativeCurrencyPrice / responseData.sellTokenToEthRate) * price).toFixed(2)
    )

    const fixedGuildFeeInNativeCurrency = GUILD_FEE_FIXED_USD / nativeCurrencyPrice

    // const gasFee = parseFloat(
    //   formatUnits(
    //     responseData.estimatedGas * responseData.gasPrice,
    //     RPC[chain].nativeCurrency.decimals
    //   )
    // )

    // TODO: calculate gas fee, maybe using a static call?
    const gasFee = 0

    const guildFee =
      gasFee + price * GUILD_FEE_PERCENTAGE + fixedGuildFeeInNativeCurrency

    return res.json({
      buyAmount: minAmount,
      price,
      priceInUSD,
      gasFee,
      gasFeeInUSD: nativeCurrencyPrice * gasFee,
      guildFee,
      guildFeeInUSD: nativeCurrencyPrice * guildFee,
      source: foundSource.name as SupportedSources,
      tokenAddressPath,
      path,
    })
  } else if (type === "ERC721" || type === "ERC1155") {
    if (!RESERVOIR_API_URLS[chain])
      return res.status(400).json({ error: "Unsupported chain" })

    const queryParams: {
      limit: string
      collection?: string
      attributes?: string
      tokens?: string
      [x: string]: string
    } = {
      collection: address,
      limit: minAmount.toString(),
    }

    if (data?.attributes?.length) {
      data.attributes.forEach(
        (attr) =>
          (queryParams[`attributes[${attr.trait_type}]`] = capitalize(attr.value))
      )
    } else if (data?.id?.length) {
      delete queryParams.collection
      queryParams.tokens = `${address}:${data.id}`
    }

    const urlSearchParams = new URLSearchParams(queryParams).toString()

    const response = await fetch(
      `${RESERVOIR_API_URLS[chain]}/tokens/v5?${urlSearchParams}`
    )

    if (response.status !== 200)
      return res.status(response.status).json({ error: response.statusText })

    const responseData = await response.json()

    if (
      !responseData.tokens?.length ||
      responseData.tokens.length < minAmount ||
      !responseData.tokens.every((t) => !!t.market.floorAsk.price)
    )
      return res.status(500).json({ error: "Couldn't find purchasable NFTs." })

    const nativeCurrencyPrice = await fetchNativeCurrencyPrice(chain)

    if (typeof nativeCurrencyPrice === "undefined")
      return res.status(500).json({
        error: `Couldn't fetch ${
          RPC[Chains[chain]].nativeCurrency.symbol
        }-USD rate.`,
      })

    const price = responseData.tokens
      .map((t) => t.market.floorAsk.price.amount.native)
      .reduce((p1, p2) => p1 + p2, 0)

    const priceInUSD = responseData.tokens
      .map((t) => t.market.floorAsk.price.amount.usd)
      .reduce((p1, p2) => p1 + p2, 0)

    const fixedGuildFeeInNativeCurrency = GUILD_FEE_FIXED_USD / nativeCurrencyPrice

    // TODO: calculate gas fee, maybe using a static call?
    const gasFee = 0

    const guildFee = price * GUILD_FEE_PERCENTAGE + fixedGuildFeeInNativeCurrency

    // TODO: source, tokenAddressPath, path
    return res.json({
      buyAmount: minAmount,
      price,
      priceInUSD,
      gasFee,
      gasFeeInUSD: nativeCurrencyPrice * gasFee,
      guildFee,
      guildFeeInUSD: nativeCurrencyPrice * guildFee,
    })
  }

  res.json(undefined)
}

export default handler
