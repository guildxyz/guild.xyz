// import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
// import { Contract } from "@ethersproject/contracts"
import { Chains } from "chains"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useEstimateGas from "hooks/useEstimateGas"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import { useMemo } from "react"
import { ADDRESS_REGEX, NULL_ADDRESS } from "utils/guildCheckout/constants"
import { generateGetAssetsParams } from "utils/guildCheckout/utils"
import processViemContractError from "utils/processViemContractError"
import { TransactionReceipt } from "viem"
import {
  useAccount,
  useBalance,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
} from "wagmi"
import { useRequirementContext } from "../../RequirementContext"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"
import { useTransactionStatusContext } from "../components/TransactionStatusContext"
import useAllowance from "./useAllowance"
import usePrice from "./usePrice"
import useTokenBuyerContractData from "./useTokenBuyerContractData"

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
  const publicClient = usePublicClient()

  const { setTxHash, setTxError, setTxSuccess } = useTransactionStatusContext()

  const {
    data: { symbol },
  } = useTokenData(requirement.chain, requirement.address)
  const { data: priceData } = usePrice(pickedCurrency)

  const tokenBuyerContractData = useTokenBuyerContractData()

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
    token: pickedCurrency,
    chainId: Chains[requirement?.chain],
    enabled: pickedCurrency !== NULL_ADDRESS,
  })

  const isSufficientBalance =
    priceData?.maxPriceInWei &&
    (coinBalanceData || tokenBalanceData) &&
    (pickedCurrency === NULL_ADDRESS
      ? coinBalanceData?.value >= priceData.maxPriceInWei
      : tokenBalanceData?.value >= priceData.maxPriceInWei)

  const contractCallParams = generatedGetAssetsParams
    ? ([...generatedGetAssetsParams.params] as const)
    : undefined

  const enabled = Boolean(
    requirement?.chain === Chains[chainId] &&
      priceData &&
      isSufficientBalance &&
      (pickedCurrency !== NULL_ADDRESS && ADDRESS_REGEX.test(pickedCurrency)
        ? typeof allowance === "bigint" && priceData.maxPriceInWei <= allowance
        : true) &&
      tokenBuyerContractData[Chains[chainId]] &&
      contractCallParams
  )

  const prepareContractWriteConfig = {
    abi: tokenBuyerContractData[Chains[chainId]]?.abi,
    address: tokenBuyerContractData[Chains[chainId]]?.address,
    functionName: "getAssets",
    args: contractCallParams,
    value: generatedGetAssetsParams?.value,
    enabled,
  }

  const {
    estimatedGas,
    estimatedGasInUSD,
    gasEstimationError,
    isLoading: isGasEstimationLoading,
  } = useEstimateGas(prepareContractWriteConfig)

  const {
    config,
    isLoading: isPrepareLoading,
    error: prepareError,
  } = usePrepareContractWrite(prepareContractWriteConfig)

  const { write, isLoading } = useContractWrite({
    ...config,
    onError: (error) => {
      setTxError(true)
      const errorMessage = processViemContractError(error)
      showErrorToast(errorMessage)
      captureEvent("Purchase requirement error (GuildCheckout)", {
        ...postHogOptions,
        error,
      })
    },
    onSuccess: async ({ hash }) => {
      setTxHash(hash)
      const receipt: TransactionReceipt =
        await publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status !== "success") {
        setTxError(true)
        showErrorToast("Transaction failed")
        captureEvent("Purchase requirement error (GuildCheckout)", {
          ...postHogOptions,
          receipt,
        })
        return
      }

      setTxSuccess(true)

      captureEvent("Purchased requirement (GuildCheckout)", postHogOptions)

      mutateAccess()

      toast({
        status: "success",
        title: "Your new asset:",
        description: `${requirement.data.minAmount} ${symbol}`,
      })
    },
  })

  return {
    isPrepareLoading,
    prepareError: processViemContractError(prepareError),
    estimatedGas,
    estimatedGasInUSD,
    gasEstimationError: processViemContractError(gasEstimationError),
    isGasEstimationLoading,
    purchaseAsset:
      typeof write === "function"
        ? () => {
            setTxError(false)
            setTxSuccess(false)
            write()
          }
        : undefined,
    isLoading,
  }
}

export default usePurchaseAsset
