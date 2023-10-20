import { Chains } from "chains"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import useToast from "hooks/useToast"
import useHasPaid from "requirements/Payment/hooks/useHasPaid"
import useVault from "requirements/Payment/hooks/useVault"
import fetcher from "utils/fetcher"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useAccount, useBalance, useChainId } from "wagmi"
import { useRequirementContext } from "../../../RequirementContext"
import useAllowance from "../../hooks/useAllowance"
import usePayFee from "../../hooks/usePayFee"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const BuyButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName, id: guildId } = useGuild()
  const toast = useToast()

  const { address } = useAccount()
  const chainId = useChainId()

  const requirement = useRequirementContext()
  const { pickedCurrency, agreeWithTOS } = useGuildCheckoutContext()

  const {
    fee,
    multiplePayments,
    isLoading: isVaultLoading,
    error,
  } = useVault(requirement.address, requirement.data.id, requirement.chain)

  const { data: hasPaid, isLoading: isHasPaidLoading } = useHasPaid(
    requirement.address,
    requirement.data.id,
    requirement.chain
  )

  const { allowance, isAllowanceLoading, allowanceError } = useAllowance(
    pickedCurrency,
    requirement.address
  )

  const { estimateGasError, onSubmit, isLoading } = usePayFee()

  // temporary (in it's current form) until POAPs are real roles and there's a capacity attribute
  const handleSubmit = async () => {
    if (requirement?.poapId) {
      const poapLinks = await fetcher(
        `/v2/guilds/${guildId}/poaps/${requirement.poapId}/links`
      )
      if (poapLinks?.claimed === poapLinks?.total)
        return toast({
          status: "error",
          title: "All available POAPs have already been claimed",
        })
    }
    onSubmit()
    captureEvent("Click: BuyButton (GuildCheckout)", {
      guild: urlName,
    })
  }

  const isSufficientAllowance =
    typeof fee === "bigint" && typeof allowance === "bigint"
      ? fee <= allowance
      : false

  const { data: coinBalanceData, isLoading: isCoinBalanceLoading } = useBalance({
    address,
    chainId,
  })
  const { data: tokenBalanceData, isLoading: isTokenBalanceLoading } = useBalance({
    address,
    token: pickedCurrency,
    chainId,
  })

  const isBalanceLoading = isCoinBalanceLoading || isTokenBalanceLoading

  const pickedCurrencyIsNative = pickedCurrency === NULL_ADDRESS

  const isSufficientBalance =
    fee &&
    (coinBalanceData?.value || tokenBalanceData?.value) &&
    (pickedCurrencyIsNative
      ? coinBalanceData.value >= fee
      : tokenBalanceData.value >= fee)

  const isDisabled =
    error ||
    estimateGasError ||
    !agreeWithTOS ||
    Chains[chainId] !== requirement.chain ||
    (!isVaultLoading && !isHasPaidLoading && !multiplePayments && hasPaid) ||
    (!pickedCurrencyIsNative &&
      (isAllowanceLoading || allowanceError || !isSufficientAllowance)) ||
    isBalanceLoading ||
    !isSufficientBalance

  const errorMsg =
    (error && "Couldn't calculate price") ||
    (estimateGasError &&
      (estimateGasError?.data?.message?.includes("insufficient")
        ? "Insufficient funds for gas"
        : "Couldn't estimate gas")) ||
    (!isSufficientBalance && "Insufficient balance") ||
    (!multiplePayments && hasPaid && "Already paid")

  return (
    <Button
      size="lg"
      isDisabled={isDisabled}
      isLoading={isLoading}
      loadingText="Check your wallet"
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={handleSubmit}
    >
      {errorMsg || "Buy pass"}
    </Button>
  )
}

export default BuyButton
