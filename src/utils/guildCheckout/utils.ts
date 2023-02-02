import { Chains, RPC } from "connectors"
import { getAssetsCallParams, NULL_ADDRESS, PurchaseAssetData } from "./constants"

const generateGetAssetsParams = (
  data: Omit<PurchaseAssetData, "tokenBuyerContract">
) => {
  if (!data) return undefined

  const { chainId, tokenAddress, amountInWithFee, source } = data

  const isNativeCurrency =
    tokenAddress === RPC[Chains[chainId]].nativeCurrency.symbol

  return [
    {
      tokenAddress: isNativeCurrency ? NULL_ADDRESS : tokenAddress,
      amount: isNativeCurrency ? 0 : amountInWithFee,
    },
    `0x${getAssetsCallParams[isNativeCurrency ? "COIN" : "ERC20"][source].commands}`,
    getAssetsCallParams[isNativeCurrency ? "COIN" : "ERC20"][
      source
    ].getEncodedParams(data),
    { value: isNativeCurrency ? amountInWithFee : undefined },
  ]
}

export { generateGetAssetsParams }
