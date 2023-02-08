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
  ZEROX_SUPPORTED_SOURCES,
} from "utils/guildCheckout/constants"

export type FetchPriceResponse = {
  sellAmount: number
  sellAmountInWei: BigNumber
  priceInBuyToken: number
  priceInWei: BigNumber
  priceInUSD: number
  guildBaseFeeInBuyToken: number
  guildFeeInBuyToken: number
  guildFeeInWei: BigNumber
  guildFeeInUSD: number
  source: ZeroXSupportedSources
  tokenAddressPath: string[]
  path: string
}

type FetchPriceBodyParams = {
  type: RequirementType
  chain: Chain
  buyToken: string
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
  buyToken: string,
  chainId: number,
  nativeCurrencyPriceInUSD: number,
  priceInBuyToken: number,
  buyTokenToEthRate: number,
  priceInUSD: number
): Promise<{
  guildBaseFeeInBuyToken: number
  guildFeeInBuyToken: number
  guildFeeInUSD: number
}> => {
  if (!TOKEN_BUYER_CONTRACT[chainId]) return Promise.reject("Unsupported chain")

  const provider = new JsonRpcProvider(RPC[Chains[chainId]].rpcUrls[0], chainId)
  const tokenBuyerContract = new Contract(
    TOKEN_BUYER_CONTRACT[chainId],
    TOKEN_BUYER_ABI,
    provider
  )

  const buyTokenDecimals = await getDecimals(Chains[chainId] as Chain, buyToken)

  const guildBaseFeeInWei = await tokenBuyerContract.baseFee(
    buyToken === RPC[Chains[chainId]].nativeCurrency.symbol ? NULL_ADDRESS : buyToken
  )
  const guildBaseFeeInBuyToken = parseFloat(
    formatUnits(guildBaseFeeInWei, buyTokenDecimals)
  )
  const guildBaseFeeInUSD =
    (nativeCurrencyPriceInUSD / buyTokenToEthRate) * guildBaseFeeInBuyToken

  const guildFeeInBuyToken =
    priceInBuyToken * GUILD_FEE_PERCENTAGE + guildBaseFeeInBuyToken

  const guildFeeInUSD = priceInUSD * GUILD_FEE_PERCENTAGE + guildBaseFeeInUSD

  return { guildBaseFeeInBuyToken, guildFeeInBuyToken, guildFeeInUSD }
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
    typeof obj.buyToken !== "string" ||
    !(
      ADDRESS_REGEX.test(obj.buyToken) ||
      obj.buyToken === RPC[obj.chain].nativeCurrency.symbol
    )
  )
    return {
      isValid: false,
      error: "Invalid buyToken address.",
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

export const fetchNativeCurrencyPriceInUSD = async (chain: Chain) =>
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

  const { type, chain, buyToken, address, data }: FetchPriceBodyParams = req.body
  const minAmount = parseFloat(data.minAmount ?? 1)

  if (type === "ERC20") {
    if (!ZEROX_API_URLS[chain])
      return res.status(400).json({ error: "Unsupported chain" })

    const decimals = await getDecimals(chain, address).catch(() =>
      res.status(500).json({ error: "Couldn't fetch sellToken decimals" })
    )

    const sellAmountInWei = parseUnits(minAmount.toFixed(decimals), decimals)

    const nativeCurrencyPriceInUSD = await fetchNativeCurrencyPriceInUSD(chain)

    if (typeof nativeCurrencyPriceInUSD === "undefined")
      return res.status(500).json({
        error: `Couldn't fetch ${
          RPC[Chains[chain]].nativeCurrency.symbol
        }-USD rate.`,
      })

    const queryParams = new URLSearchParams({
      sellToken: address,
      buyToken,
      sellAmount: sellAmountInWei.toString(),
      includedSources: ZEROX_SUPPORTED_SOURCES.toString(),
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

    const priceInBuyToken = parseFloat(responseData.guaranteedPrice) * minAmount

    const priceInUSD =
      (nativeCurrencyPriceInUSD / responseData.buyTokenToEthRate) * priceInBuyToken

    const priceInWei = BigNumber.from(relevantOrder.takerAmount)

    let guildFeeData
    try {
      guildFeeData = await getGuildFee(
        buyToken,
        Chains[chain],
        nativeCurrencyPriceInUSD,
        priceInBuyToken,
        responseData.buyTokenToEthRate,
        priceInUSD
      )
    } catch (getGuildFeeError) {
      return res.status(500).json({ error: getGuildFeeError })
    }
    const { guildBaseFeeInBuyToken, guildFeeInBuyToken, guildFeeInUSD } =
      guildFeeData

    const buyTokenDecimals = await getDecimals(chain, buyToken).catch(() =>
      res.status(500).json({ error: "Couldn't fetch buyToken decimals" })
    )

    const guildFeeInWei = parseUnits(
      guildFeeInBuyToken.toFixed(buyTokenDecimals),
      buyTokenDecimals
    )

    const source = foundSource.name as ZeroXSupportedSources

    return res.json({
      sellAmount: minAmount,
      sellAmountInWei,
      priceInBuyToken,
      priceInUSD,
      priceInWei,
      guildBaseFeeInBuyToken,
      guildFeeInBuyToken,
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
        error: `Couldn't fetch ${RPC[chain].nativeCurrency.symbol}-USD rate.`,
      })

    // buyToken is always nativeCurrency here (at least for now)
    // TODO: maybe we don't need map here? And the user will be able to buy only one token at a time?
    const priceInBuyToken = responseData.tokens
      .map((t) => t.market.floorAsk.price.amount.native)
      .reduce((p1, p2) => p1 + p2, 0)

    const priceInUSD = responseData.tokens
      .map((t) => t.market.floorAsk.price.amount.usd)
      .reduce((p1, p2) => p1 + p2, 0)

    const priceInWei = parseUnits(
      priceInBuyToken.toString(),
      RPC[chain].nativeCurrency.decimals
    )

    let guildFeeData
    try {
      guildFeeData = await getGuildFee(
        buyToken,
        Chains[chain],
        nativeCurrencyPriceInUSD,
        priceInBuyToken,
        1,
        priceInUSD
      )
    } catch (getGuildFeeError) {
      return res.status(500).json({ error: getGuildFeeError })
    }

    const { guildBaseFeeInBuyToken, guildFeeInBuyToken, guildFeeInUSD } =
      guildFeeData

    const guildFeeInWei = parseUnits(
      guildFeeInBuyToken.toString(),
      RPC[chain].nativeCurrency.decimals
    )

    const source = responseData.tokens[0].market.floorAsk.source.name

    // TODO: source, tokenAddressPath, path
    return res.json({
      sellAmount: minAmount,
      sellAmountInWei: BigNumber.from(0),
      priceInBuyToken,
      priceInUSD,
      priceInWei,
      guildBaseFeeInBuyToken,
      guildFeeInBuyToken,
      guildFeeInUSD,
      guildFeeInWei,
      source,
      tokenAddressPath: [],
      path: "",
    })
  }

  res.json(undefined)
}

export default handler
