import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { parseUnits } from "@ethersproject/units"
import { Chain, Chains, RPC } from "connectors"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { RequirementType } from "requirements"
import ERC20_ABI from "static/abis/erc20Abi.json"
import capitalize from "utils/capitalize"
import {
  ADDRESS_REGEX,
  GUILD_FEE_FIXED_USD,
  GUILD_FEE_PERCENTAGE,
  PURCHASABLE_REQUIREMENT_TYPES,
  RESERVOIR_API_URLS,
  ZeroXSupportedSources,
  ZEROX_API_URLS,
  ZEROX_EXCLUDED_SOURCES,
  ZEROX_SUPPORTED_SOURCES,
} from "utils/guildCheckout/constants"

export type FetchPriceResponse = {
  buyAmount: number
  buyAmountInWei: BigNumber
  priceInSellToken: number
  priceInWei: BigNumber
  priceInUSD: number
  guildFeeInSellToken: number
  guildFeeInWei: BigNumber
  guildFeeInUSD: number
  source: ZeroXSupportedSources
  tokenAddressPath: string[]
  path: string
}

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
    typeof obj.sellToken !== "string" ||
    !(
      ADDRESS_REGEX.test(obj.sellToken) ||
      obj.sellToken === RPC[obj.chain].nativeCurrency.symbol
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

const fetchNativeCurrencyPriceInUSD = async (chain: Chain) =>
  fetch(
    `https://api.coinbase.com/v2/exchange-rates?currency=${RPC[chain].nativeCurrency.symbol}`
  )
    .then((coinbaseRes) => coinbaseRes.json())
    .then((coinbaseData) => coinbaseData.data.rates.USD)
    .catch((_) => undefined)

const handler: NextApiHandler<FetchPriceResponse> = async (
  req: NextApiRequest,
  res: NextApiResponse<FetchPriceResponse | { error: string }>
) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: `Method ${req.method} is not allowed` })
  }

  const { isValid, error } = validateBody(req.body)

  if (!isValid) return res.status(400).json({ error })

  const { type: rawType, chain: rawChain, sellToken, address, data } = req.body
  const type = rawType as RequirementType
  const chain = rawChain as Chain
  const minAmount = parseFloat(data.minAmount ?? 1)

  if (type === "ERC20") {
    if (!ZEROX_API_URLS[chain])
      return res.status(400).json({ error: "Unsupported chain" })

    const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0], Chains[chain])
    let decimals: number

    try {
      const tokenContract = new Contract(address, ERC20_ABI, provider)
      decimals = await tokenContract.decimals()
    } catch (_) {
      return res.status(500).json({ error: "Couldn't fetch buyToken decimals." })
    }

    const buyAmountInWei = parseUnits(minAmount.toFixed(decimals), decimals)

    const nativeCurrencyPriceInUSD = await fetchNativeCurrencyPriceInUSD(chain)

    if (typeof nativeCurrencyPriceInUSD === "undefined")
      return res.status(500).json({
        error: `Couldn't fetch ${
          RPC[Chains[chain]].nativeCurrency.symbol
        }-USD rate.`,
      })

    const queryParams = new URLSearchParams({
      sellToken,
      buyToken: address,
      buyAmount: buyAmountInWei.toString(),
      excludedSources: ZEROX_EXCLUDED_SOURCES.toString(),
    }).toString()

    const response = await fetch(
      `${ZEROX_API_URLS[chain]}/swap/v1/quote?${queryParams}`
    )

    const responseData = await response.json()

    if (response.status !== 200) {
      const errorMessage = responseData.validationErrors?.length
        ? responseData.validationErrors[0].reason === "INSUFFICIENT_ASSET_LIQUIDITY"
          ? "We are not able to find this token on the market. Contact guild admins for further help."
          : responseData.validationErrors[0].description
        : response.statusText

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

    const path = relevantOrder.fillData.uniswapPath
    const tokenAddressPath = relevantOrder.fillData.tokenAddressPath

    const priceInSellToken = parseFloat(responseData.guaranteedPrice) * minAmount
    const priceInUSD = parseFloat(
      (
        (nativeCurrencyPriceInUSD / responseData.sellTokenToEthRate) *
        priceInSellToken
      ).toFixed(2)
    )

    let sellTokenDecimals: number

    try {
      if (sellToken === RPC[chain].nativeCurrency.symbol) {
        sellTokenDecimals = RPC[chain].nativeCurrency.decimals
      } else {
        const sellTokenContract = new Contract(sellToken, ERC20_ABI, provider)
        sellTokenDecimals = await sellTokenContract.decimals()
      }
    } catch (_) {
      res.status(500).json({ error: "Couldn't fetch sellToken decimals" })
    }

    const priceInWei = parseUnits(
      priceInSellToken.toFixed(sellTokenDecimals),
      sellTokenDecimals
    )

    const fixedGuildFeeInNativeCurrency =
      GUILD_FEE_FIXED_USD / nativeCurrencyPriceInUSD
    const fixedGuildFeeInSellToken =
      fixedGuildFeeInNativeCurrency * responseData.sellTokenToEthRate

    const guildFeeInSellToken =
      priceInSellToken * GUILD_FEE_PERCENTAGE + fixedGuildFeeInSellToken
    const guildFeeInWei = parseUnits(
      guildFeeInSellToken.toFixed(sellTokenDecimals),
      sellTokenDecimals
    )

    const guildFeeInUSD = priceInUSD * GUILD_FEE_PERCENTAGE + GUILD_FEE_FIXED_USD

    const source = foundSource.name as ZeroXSupportedSources

    return res.json({
      buyAmount: minAmount,
      buyAmountInWei,
      priceInSellToken,
      priceInUSD,
      priceInWei,
      guildFeeInSellToken,
      guildFeeInUSD,
      guildFeeInWei,
      source,
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

    const nativeCurrencyPriceInUSD = await fetchNativeCurrencyPriceInUSD(chain)

    if (typeof nativeCurrencyPriceInUSD === "undefined")
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

    // const fixedGuildFeeInNativeCurrency = GUILD_FEE_FIXED_USD / nativeCurrencyPrice

    // const guildFee = price * GUILD_FEE_PERCENTAGE + fixedGuildFeeInNativeCurrency

    // TODO: source, tokenAddressPath, path
    return res.json({
      buyAmount: minAmount,
      buyAmountInWei: BigNumber.from(0),
      priceInSellToken: 0,
      priceInWei: BigNumber.from(0),
      priceInUSD,
      guildFeeInSellToken: 0,
      guildFeeInWei: BigNumber.from(0),
      // guildFeeInUSD: nativeCurrencyPrice * guildFee,
      guildFeeInUSD: 0,
      path: "",
      tokenAddressPath: [],
      source: "Uniswap_V2",
    })
  }

  res.json(undefined)
}

export default handler
