import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import { Chains, RPC } from "connectors"
import { FetchPriceResponse } from "pages/api/fetchPrice"
import {
  getAssetsCallParams,
  NULL_ADDRESS,
  PurchaseAssetData,
  purchaseSupportedChains,
} from "./constants"

export type GeneratedGetAssetsParams = [
  {
    tokenAddress: string
    amount: BigNumberish
  },
  string,
  string[],
  {
    value?: BigNumberish
  }
]

const generateGetAssetsParams = (
  account: string,
  chainId: number,
  pickedCurrency: string,
  priceData: FetchPriceResponse
): GeneratedGetAssetsParams => {
  if (!priceData || !purchaseSupportedChains.ERC20?.includes(Chains[chainId]))
    return undefined

  const {
    priceInWei,
    guildFeeInWei: rawGuildFeeInWei,
    buyAmountInWei,
    source,
    path,
    tokenAddressPath,
  } = priceData

  if (
    !priceInWei ||
    !rawGuildFeeInWei ||
    !buyAmountInWei ||
    !source ||
    (!path && !tokenAddressPath)
  )
    return undefined

  const amountIn = BigNumber.from(priceInWei)
  const guildFeeInWei = BigNumber.from(rawGuildFeeInWei)
  const amountInWithFee = amountIn.add(guildFeeInWei)
  const amountOut = BigNumber.from(buyAmountInWei)

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

  const isNativeCurrency = Object.values(RPC)
    .map((rpcData) => rpcData.nativeCurrency.symbol)
    .includes(pickedCurrency)

  return [
    {
      tokenAddress: isNativeCurrency ? NULL_ADDRESS : pickedCurrency,
      amount: isNativeCurrency ? 0 : amountInWithFee,
    },
    `0x${getAssetsCallParams[isNativeCurrency ? "COIN" : "ERC20"][source].commands}`,
    getAssetsCallParams[isNativeCurrency ? "COIN" : "ERC20"][
      source
    ].getEncodedParams(formattedData),
    { value: isNativeCurrency ? amountInWithFee : undefined },
  ]
}

export { generateGetAssetsParams }
