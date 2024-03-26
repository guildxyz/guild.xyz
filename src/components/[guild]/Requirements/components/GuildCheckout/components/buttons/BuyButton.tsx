import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import useTokenBalance from "hooks/useTokenBalance"
import useHasPaid from "requirements/Payment/hooks/useHasPaid"
import useVault from "requirements/Payment/hooks/useVault"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useAccount, useBalance } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { useRequirementContext } from "../../../RequirementContext"
import useAllowance from "../../hooks/useAllowance"
import usePayFee from "../../hooks/usePayFee"
import { useGuildCheckoutContext } from "../GuildCheckoutContext"

const BuyButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const { address, chainId } = useAccount()

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

  const {
    error: payFeeError,
    isPreparing,
    estimatedGas,
    payFee,
    isLoading,
  } = usePayFee()

  const handleSubmit = async () => {
    payFee()
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
  const { data: tokenBalanceData, isLoading: isTokenBalanceLoading } =
    useTokenBalance({
      token: pickedCurrency,
      chainId,
      shouldFetch: pickedCurrency !== NULL_ADDRESS,
    })

  const isBalanceLoading = isCoinBalanceLoading || isTokenBalanceLoading

  const pickedCurrencyIsNative = pickedCurrency === NULL_ADDRESS

  const isSufficientBalance =
    fee &&
    (coinBalanceData?.value || tokenBalanceData?.value) &&
    (pickedCurrencyIsNative
      ? coinBalanceData?.value >= fee
      : tokenBalanceData?.value >= fee)

  const isDisabled =
    !payFee ||
    error ||
    payFeeError ||
    !agreeWithTOS ||
    Chains[chainId] !== requirement.chain ||
    (!isVaultLoading && !isHasPaidLoading && !multiplePayments && hasPaid) ||
    (!pickedCurrencyIsNative &&
      (isAllowanceLoading || allowanceError || !isSufficientAllowance)) ||
    isBalanceLoading ||
    !isSufficientBalance

  const errorMsg =
    (!multiplePayments && hasPaid && "Already paid") ||
    (!isSufficientBalance && "Insufficient balance") ||
    (error && "Couldn't calculate price") ||
    (!isPreparing && !estimatedGas && "Couldn't estimate gas")

  return (
    <Button
      data-test="buy-button"
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
