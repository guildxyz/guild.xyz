import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains, RPC } from "connectors"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import useHasPaid from "requirements/Payment/hooks/useHasPaid"
import useVault from "requirements/Payment/hooks/useVault"
import { mutate } from "swr"
import { ADDRESS_REGEX, NULL_ADDRESS } from "utils/guildCheckout/constants"
import processWalletError from "utils/processWalletError"
import { useAccount, useBalance, useChainId } from "wagmi"
import { useRequirementContext } from "../../RequirementContext"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"
import useAllowance from "./useAllowance"
import useSubmitTransaction from "./useSubmitTransaction"

const payFee = async (
  // feeCollectorContract: Contract, // WAGMI TODO
  feeCollectorContract: any,
  params: [number, Record<string, any>]
) => {
  if (!feeCollectorContract)
    return Promise.reject("Can't find FeeCollector contract.")

  try {
    await feeCollectorContract.callStatic.payFee(...params)
  } catch (callStaticError) {
    let processedCallStaticError: string

    if (callStaticError.error) {
      const walletError = processWalletError(callStaticError.error)
      processedCallStaticError = walletError.title
    }

    if (!processedCallStaticError) {
      switch (callStaticError.errorName) {
        case "VaultDoesNotExist":
          processedCallStaticError = "Vault doesn't exist"
          break
        case "TransferFailed":
          processedCallStaticError = "Transfer failed"
          break
        case "AlreadyPaid":
          processedCallStaticError = "You've already paid to this vault"
          break
        default:
          processedCallStaticError = "Contract error"
      }
    }

    return Promise.reject(processedCallStaticError)
  }

  return feeCollectorContract.payFee(...params)
}

const usePayFee = () => {
  const { captureEvent } = usePostHogContext()
  const { id, urlName } = useGuild()
  const postHogOptions = { guild: urlName }

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { address } = useAccount()
  const chainId = useChainId()

  const requirement = useRequirementContext()
  const { pickedCurrency } = useGuildCheckoutContext()

  // const feeCollectorContract = useContract(
  //   requirement.address,
  //   FEE_COLLECTOR_ABI,
  //   true
  // )
  const feeCollectorContract = null

  const {
    token,
    fee,
    multiplePayments,
    isLoading: isVaultLoading,
    refetch: refetchVault,
  } = useVault(requirement.address, requirement.data.id, requirement.chain)

  const { data: hasPaid, isLoading: isHasPaidLoading } = useHasPaid(
    requirement.address,
    requirement.data.id,
    requirement.chain
  )

  const extraParam = {
    value: token === NULL_ADDRESS ? fee : undefined,
  }

  const { data: coinBalanceData } = useBalance({
    address,
    chainId: Chains[requirement.chain],
  })
  const { data: tokenBalanceData } = useBalance({
    address,
    token: pickedCurrency as `0x${string}`,
    chainId: Chains[requirement.chain],
    enabled: !!pickedCurrency,
  })

  const pickedCurrencyIsNative =
    pickedCurrency === RPC[requirement?.chain]?.nativeCurrency?.symbol

  const isSufficientBalance =
    fee &&
    (coinBalanceData || tokenBalanceData) &&
    (pickedCurrencyIsNative
      ? coinBalanceData.value >= fee
      : tokenBalanceData.value >= fee)

  const { allowance } = useAllowance(pickedCurrency, requirement.address)

  const shouldEstimateGas =
    requirement?.chain === Chains[chainId] &&
    !isVaultLoading &&
    !isHasPaidLoading &&
    (multiplePayments || !hasPaid) &&
    typeof fee === "bigint" &&
    isSufficientBalance &&
    (ADDRESS_REGEX.test(pickedCurrency)
      ? typeof allowance === "bigint" && fee <= allowance
      : true)

  // const {
  //   estimatedGasFee,
  //   estimatedGasFeeInUSD,
  //   estimateGasError,
  //   isEstimateGasLoading,
  // } = useEstimateGasFee(
  //   requirement?.id?.toString(),
  //   shouldEstimateGas ? feeCollectorContract : null,
  //   "payFee",
  //   [requirement.data.id, extraParam]
  // )
  const estimatedGasFee = null
  const estimatedGasFeeInUSD = null
  const estimateGasError = null
  const isEstimateGasLoading = false

  const payFeeTransaction = (vaultId: number) =>
    payFee(feeCollectorContract, [vaultId, extraParam])

  const useSubmitData = useSubmitTransaction<number>(payFeeTransaction, {
    onError: (error) => {
      showErrorToast(error)
      captureEvent("Buy pass error (GuildCheckout)", postHogOptions)
      captureEvent("payFee pre-call error (GuildCheckout)", {
        ...postHogOptions,
        error,
      })
    },
    onSuccess: (receipt) => {
      if (receipt.status !== 1) {
        showErrorToast("Transaction failed")
        captureEvent("Buy pass error (GuildCheckout)", {
          ...postHogOptions,
          receipt,
        })
        captureEvent("payFee error (GuildCheckout)", {
          ...postHogOptions,
          receipt,
        })
        return
      }

      captureEvent("Bought pass (GuildCheckout)", postHogOptions)
      toast({
        status: "success",
        title: "Successful payment",
      })

      refetchVault()

      // temporary until POAPs are real roles
      if (requirement?.poapId)
        mutate(
          `/v2/guilds/:guildId/poaps/${requirement.poapId}/users/${address}/eligibility`
        )
      else mutate(`/guild/access/${id}/${address}`)
    },
  })

  return {
    ...useSubmitData,
    onSubmit: () => useSubmitData.onSubmit(requirement.data.id),
    estimatedGasFee,
    estimatedGasFeeInUSD,
    estimateGasError,
    isEstimateGasLoading,
  }
}

export default usePayFee
