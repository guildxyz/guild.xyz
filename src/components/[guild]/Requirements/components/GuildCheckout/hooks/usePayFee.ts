import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import useToast from "hooks/useToast"
import useTokenBalance from "hooks/useTokenBalance"
import useHasPaid from "requirements/Payment/hooks/useHasPaid"
import useVault from "requirements/Payment/hooks/useVault"
import feeCollectorAbi from "static/abis/feeCollector"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useAccount, useBalance } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { useRequirementContext } from "../../RequirementContext"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContext"
import useAllowance from "./useAllowance"

const usePayFee = () => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()
  const postHogOptions = { guild: urlName }

  const { address, chainId } = useAccount()

  const requirement = useRequirementContext()
  const { pickedCurrency, onClose } = useGuildCheckoutContext()

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
  const { data: tokenBalanceData } = useTokenBalance({
    token: pickedCurrency as `0x${string}`,
    chainId: Chains[requirement.chain],
    shouldFetch: !pickedCurrencyIsNative,
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
    (!pickedCurrencyIsNative
      ? typeof allowance === "bigint" && fee <= allowance
      : fee < coinBalanceData?.value)

  const contractCallParams = {
    abi: feeCollectorAbi,
    address: requirement.address,
    functionName: "payFee",
    args: [BigInt(requirement.data.id)],
    value: pickedCurrencyIsNative ? fee : undefined,
    chainId: Chains[requirement.chain],
    query: {
      enabled,
    },
  } as const

  const { triggerMembershipUpdate } = useMembershipUpdate()

  const { error, isPreparing, isLoading, estimatedGas, onSubmitTransaction } =
    useSubmitTransaction(contractCallParams, {
      customErrorsMap: {
        VaultDoesNotExist: "Vault doesn't exist",
        TransferFailed: "Transfer failed",
        AlreadyPaid: "You've already paid to this vault",
      },
      onError: (errorMessage, rawError) => {
        showErrorToast(errorMessage ?? "Unknown error")
        captureEvent("Buy pass error (GuildCheckout)", {
          ...postHogOptions,
          error: rawError,
        })
      },
      onSuccess: () => {
        captureEvent("Bought pass (GuildCheckout)", postHogOptions)
        toast({
          status: "success",
          title: "Successful payment",
        })

        onClose()

        refetchVault()
        triggerMembershipUpdate({ roleIds: [requirement.roleId] })
      },
    })

  return {
    isPreparing,
    error,
    estimatedGas,
    payFee: onSubmitTransaction,
    isLoading,
  }
}

export default usePayFee
