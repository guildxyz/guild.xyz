import { RPC } from "connectors"
import { getAssetsCallParams, NULL_ADDRESS, PurchaseAssetData } from "./constants"

const generateGetAssetsParams = (
  data: Omit<PurchaseAssetData, "tokenBuyerContract">
) => {
  if (!data) return undefined

  const { tokenAddress, amountInWithFee, source } = data

  const isNativeCurrency = Object.values(RPC)
    .map((rpcData) => rpcData.nativeCurrency.symbol)
    .includes(tokenAddress)

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
