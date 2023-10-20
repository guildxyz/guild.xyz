import { CHAIN_CONFIG, Chains } from "chains"
import { FetchPriceResponse } from "pages/api/fetchPrice"
import {
  NULL_ADDRESS,
  PurchaseAssetData,
  getAssetsCallParams,
  purchaseSupportedChains,
} from "./constants"

export type GeneratedGetAssetsParams =
  | [
      number,
      {
        tokenAddress: string
        amount: bigint
      },
      string,
      string[],
      {
        value?: bigint
        gasLimit?: bigint
      }
    ]
  | [
      {
        tokenAddress: string
        amount: bigint
      },
      string,
      string[],
      {
        value?: bigint
        gasLimit?: bigint
      }
    ]

const generateGetAssetsParams = (
  guildId: number,
  account: string,
  chainId: number,
  pickedCurrency: string,
  priceData: FetchPriceResponse<bigint>
): GeneratedGetAssetsParams => {
  if (!priceData || !purchaseSupportedChains.ERC20?.includes(Chains[chainId]))
    return undefined

  const {
    maxPriceInWei,
    maxGuildFeeInWei: rawMaxGuildFeeInWei,
    buyAmountInWei,
    source,
    path,
    tokenAddressPath,
  } = priceData

  if (
    !guildId ||
    !account ||
    !maxPriceInWei ||
    !rawMaxGuildFeeInWei ||
    !buyAmountInWei ||
    !source ||
    (!path && !tokenAddressPath)
  )
    return undefined

  const amountIn = maxPriceInWei
  const guildFeeInWei = rawMaxGuildFeeInWei
  const amountInWithFee = amountIn + guildFeeInWei
  const amountOut = buyAmountInWei

  const formattedData: PurchaseAssetData = {
    chainId,
    account,
    tokenAddress: pickedCurrency,
    amountIn,
    amountInWithFee,
    amountOut,
    source,
    path,
    tokenAddressPath,
  }

  const isNativeCurrency = Object.values(CHAIN_CONFIG)
    .map((rpcData) => rpcData.nativeCurrency.symbol)
    .includes(pickedCurrency)

  if (Chains[chainId] === "ARBITRUM")
    return [
      {
        tokenAddress: isNativeCurrency ? NULL_ADDRESS : pickedCurrency,
        amount: isNativeCurrency ? BigInt(0) : amountInWithFee,
      },
      `0x${
        getAssetsCallParams[isNativeCurrency ? "COIN" : "ERC20"][source].commands
      }`,
      getAssetsCallParams[isNativeCurrency ? "COIN" : "ERC20"][
        source
      ].getEncodedParams(formattedData),
      { value: isNativeCurrency ? amountInWithFee : undefined },
    ]

  return [
    guildId,
    {
      tokenAddress: isNativeCurrency ? NULL_ADDRESS : pickedCurrency,
      amount: isNativeCurrency ? BigInt(0) : amountInWithFee,
    },
    `0x${getAssetsCallParams[isNativeCurrency ? "COIN" : "ERC20"][source].commands}`,
    getAssetsCallParams[isNativeCurrency ? "COIN" : "ERC20"][
      source
    ].getEncodedParams(formattedData),
    { value: isNativeCurrency ? amountInWithFee : undefined },
  ]
}

const flipPath = (pathToFlip: string): string => {
  if (!pathToFlip?.length) return undefined

  const ADDRESS_LENGTH = 40
  const TICK_SPACING_LENGTH = 6
  const pathString = pathToFlip.replace("0x", "")

  const pathSegments = []
  let iteration = 1,
    startIndex = 0,
    endIndex = 0

  do {
    endIndex += iteration % 2 === 1 ? ADDRESS_LENGTH : TICK_SPACING_LENGTH
    pathSegments.push(pathString.slice(startIndex, endIndex))
    startIndex = endIndex
    iteration++
  } while (endIndex < pathString.length)

  const reversedPathSegments = pathSegments.reverse()

  const flippedPath = `0x${reversedPathSegments.join("")}`

  return flippedPath
}

export { flipPath, generateGetAssetsParams }
