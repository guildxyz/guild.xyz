import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import useDatadog from "components/_app/Datadog/useDatadog"
import { Chains } from "connectors"
import useContract from "hooks/useContract"
import useEstimateGasFee from "hooks/useEstimateGasFee"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import { Dispatch, SetStateAction, useMemo } from "react"
import TOKEN_BUYER_ABI from "static/abis/tokenBuyerAbi.json"
import {
  PurchaseAssetData,
  purchaseSupportedChains,
  TOKEN_BUYER_CONTRACT,
} from "utils/guildCheckout/constants"
import { generateGetAssetsParams } from "utils/guildCheckout/utils"
import processWalletError from "utils/processWalletError"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"
import usePrice from "./usePrice"

const purchaseAsset = async (
  data: PurchaseAssetData,
  setTxHash: Dispatch<SetStateAction<string>>
) => {
  const { chainId, tokenBuyerContract } = data

  if (!purchaseSupportedChains.ERC20?.includes(Chains[chainId]))
    return Promise.reject("Unsupported chain")

  const getAssetsParams = generateGetAssetsParams(data)

  try {
    await tokenBuyerContract.callStatic.getAssets(...getAssetsParams)
  } catch (callStaticError) {
    if (callStaticError.error) {
      const walletError = processWalletError(callStaticError.error)
      return Promise.reject(walletError.title)
    }

    if (!callStaticError.errorName) return Promise.reject(callStaticError)

    // TODO: we could handle Uniswap universal router errors too
    switch (callStaticError.errorName) {
      case "AccessDenied":
        return Promise.reject("TokenBuyer contract error: access denied")
      case "TransferFailed":
        return Promise.reject("TokenBuyer contract error: ERC20 transfer failed")
    }
  }

  const getAssetsCall = await tokenBuyerContract.getAssets(...getAssetsParams)

  setTxHash(getAssetsCall.hash)

  return getAssetsCall.wait()
}

const usePurchaseAsset = () => {
  const { addDatadogAction, addDatadogError } = useDatadog()

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { account, chainId } = useWeb3React()

  const {
    requirement,
    pickedCurrency,
    txHash,
    setTxHash,
    setTxSuccess,
    setTxError,
  } = useGuildCheckoutContext()
  const {
    data: { symbol },
  } = useTokenData(requirement.chain, requirement.address)
  const {
    data: {
      priceInWei,
      guildFeeInWei: rawGuildFeeInWei,
      buyAmountInWei,
      source,
      path,
      tokenAddressPath,
    },
  } = usePrice(pickedCurrency)

  const tokenBuyerContract = useContract(TOKEN_BUYER_CONTRACT, TOKEN_BUYER_ABI, true)

  const purchaseAssetData = useMemo(() => {
    if (
      !chainId ||
      !account ||
      !tokenBuyerContract ||
      !pickedCurrency ||
      !priceInWei ||
      !rawGuildFeeInWei ||
      !buyAmountInWei ||
      !source ||
      !path ||
      !tokenAddressPath
    )
      return undefined

    const amountIn = BigNumber.from(priceInWei)
    const guildFeeInWei = BigNumber.from(rawGuildFeeInWei)
    const amountInWithFee = amountIn.add(guildFeeInWei)
    const amountOut = BigNumber.from(buyAmountInWei)

    return {
      chainId,
      account,
      tokenBuyerContract,
      tokenAddress: pickedCurrency,
      amountIn,
      amountInWithFee,
      amountOut,
      source,
      path,
      tokenAddressPath,
    }
  }, [
    chainId,
    account,
    tokenBuyerContract,
    pickedCurrency,
    priceInWei,
    rawGuildFeeInWei,
    buyAmountInWei,
    source,
    path,
    tokenAddressPath,
  ])

  const generatedGetAssetsParams = useMemo(
    () => (purchaseAsset ? generateGetAssetsParams(purchaseAssetData) : undefined),
    [purchaseAssetData]
  )

  const { data: estimatedGas, error: estimateGasError } = useEstimateGasFee(
    tokenBuyerContract,
    "getAssets",
    generatedGetAssetsParams
  )

  const purchaseAssetWithSetTx = (data?: PurchaseAssetData) =>
    purchaseAsset(data, setTxHash)

  const useSubmitData = useSubmit<PurchaseAssetData, any>(purchaseAssetWithSetTx, {
    onError: (error) => {
      const prettyError =
        error?.code === "ACTION_REJECTED" ? "User rejected the transaction" : error
      showErrorToast(prettyError)
      if (txHash) setTxError(true)
      addDatadogError("purchase requirement error (GuildCheckout)", {
        error: prettyError,
      })
    },
    onSuccess: (receipt) => {
      if (receipt.status !== 1) {
        showErrorToast("Transaction failed")
        setTxError(true)
        console.log("[DEBUG]: TX RECEIPT", receipt)
        addDatadogError("purchase requirement error (GuildCheckout)", {
          receipt,
        })
        return
      }

      addDatadogAction("purchased requirement (GuildCheckout)")
      setTxSuccess(true)
      toast({
        status: "success",
        title: "Your new asset:",
        description: `${requirement.data.minAmount} ${symbol}`,
      })
    },
  })

  return {
    ...useSubmitData,
    onSubmit: () => useSubmitData.onSubmit(purchaseAssetData),
    estimatedGas,
    estimateGasError,
  }
}

export default usePurchaseAsset
