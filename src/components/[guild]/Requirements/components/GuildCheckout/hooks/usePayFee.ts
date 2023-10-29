import { Chains } from "chains"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useEstimateGas from "hooks/useEstimateGas"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import useHasPaid from "requirements/Payment/hooks/useHasPaid"
import useVault from "requirements/Payment/hooks/useVault"
import feeCollectorAbi from "static/abis/feeCollector"
import { mutate } from "swr"
import { ADDRESS_REGEX, NULL_ADDRESS } from "utils/guildCheckout/constants"
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
import useAllowance from "./useAllowance"

const usePayFee = () => {
  const { captureEvent } = usePostHogContext()
  const { id, urlName } = useGuild()
  const postHogOptions = { guild: urlName }

  const { address } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()

  const requirement = useRequirementContext()
  const { pickedCurrency } = useGuildCheckoutContext()

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const {
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

  const pickedCurrencyIsNative = pickedCurrency === NULL_ADDRESS

  const { data: coinBalanceData } = useBalance({
    address,
    chainId: Chains[requirement.chain],
  })
  const { data: tokenBalanceData } = useBalance({
    address,
    token: pickedCurrency as `0x${string}`,
    chainId: Chains[requirement.chain],
    enabled: !pickedCurrencyIsNative,
  })

  const isSufficientBalance =
    fee &&
    (coinBalanceData || tokenBalanceData) &&
    (pickedCurrencyIsNative
      ? coinBalanceData?.value >= fee
      : tokenBalanceData?.value >= fee)

  const { allowance } = useAllowance(pickedCurrency, requirement.address)

  const enabled =
    requirement?.chain === Chains[chainId] &&
    !isVaultLoading &&
    !isHasPaidLoading &&
    (multiplePayments || !hasPaid) &&
    typeof fee === "bigint" &&
    isSufficientBalance &&
    (ADDRESS_REGEX.test(pickedCurrency)
      ? typeof allowance === "bigint" && fee <= allowance
      : true)

  const contractCallParams = {
    abi: feeCollectorAbi,
    address: requirement.address,
    functionName: "payFee",
    args: [BigInt(requirement.data.id)],
    value: pickedCurrencyIsNative ? fee : undefined,
    chainId: Chains[requirement.chain],
    enabled,
  } as const

  const {
    config,
    error: prepareError,
    isLoading: isPrepareLoading,
  } = usePrepareContractWrite(contractCallParams)

  const {
    estimatedGas,
    gasEstimationError,
    isLoading: isGasEstimationLoading,
  } = useEstimateGas(contractCallParams)

  const { write, isLoading } = useContractWrite({
    ...config,
    onError: (error) => {
      const errorMessage = processViemContractError(error)
      showErrorToast(errorMessage)
    },
    onSuccess: async ({ hash }) => {
      const receipt: TransactionReceipt =
        await publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status !== "success") {
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
    isPrepareLoading,
    prepareError: getErrorMessage(prepareError),
    estimatedGas,
    gasEstimationError: getErrorMessage(gasEstimationError),
    isGasEstimationLoading,
    payFee: write,
    isLoading,
  }
}

const getErrorMessage = (rawPrepareError: Error) =>
  processViemContractError(rawPrepareError, (errorName) => {
    switch (errorName) {
      case "VaultDoesNotExist":
        return "Vault doesn't exist"

      case "TransferFailed":
        return "Transfer failed"

      case "AlreadyPaid":
        return "You've already paid to this vault"

      default:
        return "Contract error"
    }
  })

export default usePayFee
