// import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
// import { Contract } from "@ethersproject/contracts"
import { Chains } from "chains"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import { useMemo } from "react"
import { ADDRESS_REGEX, NULL_ADDRESS } from "utils/guildCheckout/constants"
import {
  GeneratedGetAssetsParams,
  generateGetAssetsParams,
} from "utils/guildCheckout/utils"
import processWalletError from "utils/processWalletError"
import { useAccount, useBalance, useChainId } from "wagmi"
import { useRequirementContext } from "../../RequirementContext"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"
import useAllowance from "./useAllowance"
import usePrice from "./usePrice"
import useSubmitTransaction from "./useSubmitTransaction"
import useTokenBuyerContractData from "./useTokenBuyerContractData"

const isConfigParam = (
  param: any
): param is {
  value?: bigint
  gasLimit?: bigint
} => "value" in (param ?? {})

const purchaseAsset = async (
  tokenBuyerContract: any,
  generatedGetAssetsParams: GeneratedGetAssetsParams,
  estimatedGasLimit?: bigint
) => {
  // We shouldn't run into these issues, but rejecting here in case something wrong happens.
  if (!tokenBuyerContract) return Promise.reject("Can't find TokenBuyer contract.")
  if (!generatedGetAssetsParams)
    return Promise.reject("Couldn't generate getAssets params.")

  // Adjusting the gas limit to avoid failing transactions)
  // TODO: rethink the way we use generateGetAssetsParams, maybe we can find a cleaner solution for adjusting gas fee here.
  const generatedGetAssetsParamsWithGasLimit = [...generatedGetAssetsParams]

  if (estimatedGasLimit) {
    const customGasLimit = (estimatedGasLimit * BigInt(12)) / BigInt(10)
    if (isConfigParam(generatedGetAssetsParamsWithGasLimit[4]))
      generatedGetAssetsParamsWithGasLimit[4].gasLimit = customGasLimit
    else if (isConfigParam(generatedGetAssetsParamsWithGasLimit[3]))
      generatedGetAssetsParamsWithGasLimit[3].gasLimit = customGasLimit
  }

  try {
    await tokenBuyerContract.callStatic.getAssets(
      ...generatedGetAssetsParamsWithGasLimit
    )
  } catch (callStaticError) {
    if (callStaticError.error) {
      const walletError = processWalletError(callStaticError.error)
      return Promise.reject(walletError.title)
    }

    if (!callStaticError.errorName) return Promise.reject(callStaticError)

    switch (callStaticError.errorName) {
      case "AccessDenied":
        return Promise.reject("TokenBuyer contract error: access denied")
      case "TransferFailed":
        return Promise.reject("TokenBuyer contract error: ERC20 transfer failed")
      default:
        return Promise.reject(callStaticError.errorName)
    }
  }

  return tokenBuyerContract.getAssets(...generatedGetAssetsParamsWithGasLimit)
}

const usePurchaseAsset = () => {
  const { captureEvent } = usePostHogContext()
  const { id: guildId, urlName } = useGuild()

  const requirement = useRequirementContext()
  const { pickedCurrency } = useGuildCheckoutContext()

  const { mutate: mutateAccess } = useAccess(requirement?.roleId)

  const postHogOptions = { guild: urlName, chain: requirement.chain }

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { address } = useAccount()
  const chainId = useChainId()

  const {
    data: { symbol },
  } = useTokenData(requirement.chain, requirement.address)
  const { data: priceData } = usePrice(pickedCurrency)

  const tokenBuyerContractData = useTokenBuyerContractData()

  // WAGMI TODO
  // const tokenBuyerContract = useContract(
  //   tokenBuyerContractData[Chains[chainId]]?.address,
  //   tokenBuyerContractData[Chains[chainId]]?.abi,
  //   true
  // )
  const tokenBuyerContract = null

  const generatedGetAssetsParams = useMemo(
    () =>
      generateGetAssetsParams(guildId, address, chainId, pickedCurrency, priceData),
    [guildId, address, chainId, pickedCurrency, priceData]
  )

  const { allowance } = useAllowance(
    pickedCurrency,
    tokenBuyerContractData[Chains[chainId]]?.address
  )

  const { data: coinBalanceData } = useBalance({
    address,
    chainId: Chains[requirement?.chain],
  })
  const { data: tokenBalanceData } = useBalance({
    address,
    token: pickedCurrency as `0x${string}`,
    chainId: Chains[requirement?.chain],
  })

  const isSufficientBalance =
    priceData?.maxPriceInWei &&
    (coinBalanceData || tokenBalanceData) &&
    (pickedCurrency === NULL_ADDRESS
      ? coinBalanceData?.value >= priceData.maxPriceInWei
      : tokenBalanceData?.value >= priceData.maxPriceInWei)

  const shouldEstimateGas =
    requirement?.chain === Chains[chainId] &&
    priceData &&
    isSufficientBalance &&
    (ADDRESS_REGEX.test(pickedCurrency)
      ? typeof allowance === "bigint" && priceData.maxPriceInWei <= allowance
      : true)

  // const {
  //   estimatedGasLimit,
  //   estimatedGasFee,
  //   estimatedGasFeeInUSD,
  //   estimateGasError,
  // } = useEstimateGasFee(
  //   requirement?.id?.toString(),
  //   shouldEstimateGas ? tokenBuyerContract : null,
  //   "getAssets",
  //   generatedGetAssetsParams
  // )
  const estimatedGasFee = null
  const estimatedGasFeeInUSD = null
  const estimateGasError = null
  const estimatedGasLimit = null

  const purchaseAssetTransaction = (data?: GeneratedGetAssetsParams) =>
    purchaseAsset(tokenBuyerContract, data, estimatedGasLimit)

  const useSubmitData = useSubmitTransaction<GeneratedGetAssetsParams>(
    purchaseAssetTransaction,
    {
      onError: (error) => {
        showErrorToast(error)
        captureEvent("Purchase requirement error (GuildCheckout)", {
          ...postHogOptions,
          error,
        })
        captureEvent("getAssets pre-call error (GuildCheckout)", {
          ...postHogOptions,
          error,
        })
      },
      onSuccess: (receipt) => {
        if (receipt.status !== 1) {
          showErrorToast("Transaction failed")
          captureEvent("Purchase requirement error (GuildCheckout)", {
            ...postHogOptions,
            receipt,
          })
          captureEvent("getAssets error (GuildCheckout)", {
            ...postHogOptions,
            receipt,
          })
          return
        }

        captureEvent("Purchased requirement (GuildCheckout)", postHogOptions)

        mutateAccess()

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
    estimatedGasFee,
    estimatedGasFeeInUSD,
    estimateGasError,
  }
}

export default usePurchaseAsset
