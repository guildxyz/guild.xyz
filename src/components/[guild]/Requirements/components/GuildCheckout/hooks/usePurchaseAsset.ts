import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import useDatadog from "components/_app/Datadog/useDatadog"
import useContract from "hooks/useContract"
import useEstimateGasFee from "hooks/useEstimateGasFee"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import { Dispatch, SetStateAction, useMemo } from "react"
import TOKEN_BUYER_ABI from "static/abis/tokenBuyerAbi.json"
import { TOKEN_BUYER_CONTRACT } from "utils/guildCheckout/constants"
import {
  GeneratedGetAssetsParams,
  generateGetAssetsParams,
} from "utils/guildCheckout/utils"
import processWalletError from "utils/processWalletError"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"
import usePrice from "./usePrice"

const purchaseAsset = async (
  tokenBuyerContract: Contract,
  generatedGetAssetsParams: GeneratedGetAssetsParams,
  setTxHash: Dispatch<SetStateAction<string>>
) => {
  // We shouldn't run into these issues, but rejecting here in case something wrong happens.
  if (!tokenBuyerContract) return Promise.reject("Can't find TokenBuyer contract.")
  if (!generatedGetAssetsParams)
    return Promise.reject("Couldn't generate getAssets params.")
  try {
    await tokenBuyerContract.callStatic.getAssets(...generatedGetAssetsParams)
  } catch (callStaticError) {
    if (callStaticError.error) {
      const walletError = processWalletError(callStaticError.error)
      return Promise.reject(walletError.title)
    }

    if (!callStaticError.errorName) return Promise.reject(callStaticError)

    // TODO: we could handle Uniswap universal router errors too
    // https://github.com/Uniswap/universal-router/blob/main/contracts/interfaces/IUniversalRouter.sol
    switch (callStaticError.errorName) {
      case "AccessDenied":
        return Promise.reject("TokenBuyer contract error: access denied")
      case "TransferFailed":
        return Promise.reject("TokenBuyer contract error: ERC20 transfer failed")
    }
  }

  const getAssetsCall = await tokenBuyerContract.getAssets(
    ...generatedGetAssetsParams
  )

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
  const { data: priceData } = usePrice(pickedCurrency)

  const tokenBuyerContract = useContract(TOKEN_BUYER_CONTRACT, TOKEN_BUYER_ABI, true)

  const generatedGetAssetsParams = useMemo(
    () => generateGetAssetsParams(account, chainId, pickedCurrency, priceData),
    [account, chainId, pickedCurrency, priceData]
  )

  const { data: estimatedGas, error: estimateGasError } = useEstimateGasFee(
    tokenBuyerContract,
    "getAssets",
    generatedGetAssetsParams
  )

  const purchaseAssetWithSetTx = (data?: GeneratedGetAssetsParams) =>
    purchaseAsset(tokenBuyerContract, data, setTxHash)

  const useSubmitData = useSubmit<GeneratedGetAssetsParams, any>(
    purchaseAssetWithSetTx,
    {
      onError: (error) => {
        const prettyError =
          error?.code === "ACTION_REJECTED" ? "User rejected the transaction" : error
        showErrorToast(prettyError)
        if (txHash) setTxError(true)
        addDatadogError("general purchase requirement error (GuildCheckout)")
        addDatadogError("purchase requirement pre-call error (GuildCheckout)", {
          error: prettyError,
        })
      },
      onSuccess: (receipt) => {
        if (receipt.status !== 1) {
          showErrorToast("Transaction failed")
          setTxError(true)
          console.log("[DEBUG]: TX RECEIPT", receipt)
          addDatadogError("general purchase requirement error (GuildCheckout)")
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
    }
  )

  return {
    ...useSubmitData,
    onSubmit: () => useSubmitData.onSubmit(generatedGetAssetsParams),
    estimatedGas,
    estimateGasError,
  }
}

export default usePurchaseAsset
