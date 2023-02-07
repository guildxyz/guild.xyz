import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { formatUnits, parseUnits } from "@ethersproject/units"
import { Chain, Chains, RPC } from "connectors"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { RequirementType } from "requirements"
import ERC20_ABI from "static/abis/erc20Abi.json"
import TOKEN_BUYER_ABI from "static/abis/tokenBuyerAbi.json"
import capitalize from "utils/capitalize"
import {
  ADDRESS_REGEX,
  GUILD_FEE_PERCENTAGE,
  NULL_ADDRESS,
  PURCHASABLE_REQUIREMENT_TYPES,
  RESERVOIR_API_URLS,
  TOKEN_BUYER_CONTRACT,
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
  guildBaseFeeInNativeCurrency: number
  guildPercentageFeeInNativeCurrency: number
  guildFeeInWei: BigNumber
  guildFeeInSellToken: number
  guildFeeInUSD: number
  source: ZeroXSupportedSources
  tokenAddressPath: string[]
  path: string
}

type FetchPriceBodyParams = {
  type: RequirementType
  chain: Chain
  sellToken: string
  address: string
  data: Record<string, any>
}

const getDecimals = async (chain: Chain, tokenAddress: string) => {
  if (tokenAddress === RPC[chain].nativeCurrency.symbol)
    return RPC[chain].nativeCurrency.decimals

  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0], Chains[chain])
  const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider)
  const decimals = await tokenContract.decimals()

  return decimals
}

const getGuildFee = async (
  sellToken: string,
  chainId: number,
  nativeCurrencyPriceInUSD: number,
  priceInUSD: number
): Promise<{
  guildBaseFeeInNativeCurrency: number
  guildPercentageFeeInNativeCurrency: number
  guildFeeInUSD: number
  guildFeeInSellToken: number
  guildFeeInWei: BigNumber
}> => {
  const provider = new JsonRpcProvider(RPC[Chains[chainId]].rpcUrls[0], chainId)
  const tokenBuyerContract = new Contract(
    TOKEN_BUYER_CONTRACT[chainId],
    TOKEN_BUYER_ABI,
    provider
  )

  const sellTokenDecimals = await getDecimals(Chains[chainId] as Chain, sellToken)
  const guildBaseFeeInWei = await tokenBuyerContract.baseFee(
    sellToken === RPC[Chains[chainId]].nativeCurrency.symbol
      ? NULL_ADDRESS
      : sellToken
  )
  const nativeCurrencyDecimals = RPC[Chains[chainId]].nativeCurrency.decimals
  const guildBaseFeeInNativeCurrency = parseFloat(
    formatUnits(guildBaseFeeInWei, nativeCurrencyDecimals)
  )
  const guildBaseFeeInUSD = nativeCurrencyPriceInUSD * guildBaseFeeInNativeCurrency

  const guildPercentageFeeInNativeCurrency =
    (priceInUSD / nativeCurrencyPriceInUSD) * GUILD_FEE_PERCENTAGE

  const guildFeeInUSD = priceInUSD * GUILD_FEE_PERCENTAGE + guildBaseFeeInUSD

  const guildFeeInWei = parseUnits(
    (guildBaseFeeInNativeCurrency + guildPercentageFeeInNativeCurrency).toFixed(
      nativeCurrencyDecimals
    ),
    nativeCurrencyDecimals
  )

  const guildFeeInSellToken = parseFloat(
    formatUnits(guildFeeInWei, sellTokenDecimals)
  )

  return {
    guildBaseFeeInNativeCurrency,
    guildPercentageFeeInNativeCurrency,
    // Cumulated fee (percentage + fixed)
    guildFeeInUSD,
    guildFeeInSellToken,
    guildFeeInWei,
  }
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

  const { type, chain, sellToken, address, data }: FetchPriceBodyParams = req.body
  const minAmount = parseFloat(data.minAmount ?? 1)

  if (type === "ERC20") {
    if (!ZEROX_API_URLS[chain])
      return res.status(400).json({ error: "Unsupported chain" })

    const decimals = await getDecimals(chain, address).catch(() =>
      res.status(500).json({ error: "Couldn't fetch buyToken decimals" })
    )

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

    const { uniswapPath: path, tokenAddressPath } = relevantOrder.fillData

    const priceInSellToken = parseFloat(responseData.guaranteedPrice) * minAmount
    const priceInUSD = parseFloat(
      (
        (nativeCurrencyPriceInUSD / responseData.sellTokenToEthRate) *
        priceInSellToken
      ).toFixed(2)
    )

    const sellTokenDecimals = await getDecimals(chain, sellToken).catch(() =>
      res.status(500).json({ error: "Couldn't fetch sellToken decimals" })
    )

    const priceInWei = parseUnits(
      priceInSellToken.toFixed(sellTokenDecimals),
      sellTokenDecimals
    )

    const {
      guildBaseFeeInNativeCurrency,
      guildPercentageFeeInNativeCurrency,
      guildFeeInUSD,
      guildFeeInSellToken,
      guildFeeInWei,
    } = await getGuildFee(
      sellToken,
      Chains[chain],
      nativeCurrencyPriceInUSD,
      priceInUSD
    )

    const source = foundSource.name as ZeroXSupportedSources

    return res.json({
      buyAmount: minAmount,
      buyAmountInWei,
      priceInSellToken,
      priceInUSD,
      priceInWei,
      guildBaseFeeInNativeCurrency,
      guildPercentageFeeInNativeCurrency,
      guildFeeInUSD,
      guildFeeInSellToken,
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
        error: `Couldn't fetch ${RPC[chain].nativeCurrency.symbol}-USD rate.`,
      })

    // sellToken is always nativeCurrency here (at least for now)
    // TODO: maybe we don't need map here? And the user will be able to buy only one token at a time?
    const priceInSellToken = responseData.tokens
      .map((t) => t.market.floorAsk.price.amount.native)
      .reduce((p1, p2) => p1 + p2, 0)

    const priceInUSD = responseData.tokens
      .map((t) => t.market.floorAsk.price.amount.usd)
      .reduce((p1, p2) => p1 + p2, 0)

    const priceInWei = parseUnits(
      priceInSellToken.toString(),
      RPC[chain].nativeCurrency.decimals
    )

    const {
      guildBaseFeeInNativeCurrency,
      guildPercentageFeeInNativeCurrency,
      guildFeeInUSD,
      guildFeeInSellToken,
      guildFeeInWei,
    } = await getGuildFee(
      sellToken,
      Chains[chain],
      nativeCurrencyPriceInUSD,
      priceInUSD
    )

    const source = responseData.tokens[0].market.floorAsk.source.name

    // TODO: source, tokenAddressPath, path
    return res.json({
      buyAmount: minAmount,
      buyAmountInWei: BigNumber.from(0),
      priceInSellToken,
      priceInUSD,
      priceInWei,
      guildBaseFeeInNativeCurrency,
      guildPercentageFeeInNativeCurrency,
      guildFeeInUSD,
      guildFeeInSellToken,
      guildFeeInWei,
      source,
      tokenAddressPath: [],
      path: "",
    })
  }

  res.json(undefined)
}

export default handler
