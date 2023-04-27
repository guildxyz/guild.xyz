import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Chains, RPC } from "connectors"
import useBalance from "hooks/useBalance"
import useHasPaid from "requirements/Payment/hooks/useHasPaid"
import useVault from "requirements/Payment/hooks/useVault"
import useAllowance from "../../hooks/useAllowance"
import usePayFee from "../../hooks/usePayFee"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const BuyButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const { chainId } = useWeb3React()
  const { requirement, pickedCurrency, agreeWithTOS } = useGuildCheckoutContext()

  const {
    data: { fee, multiplePayments },
    isValidating: isVaultLoading,
    error,
  } = useVault(requirement.address, requirement.data.id, requirement.chain)

  const { data: hasPaid, isValidating: isHasPaidLoading } = useHasPaid(
    requirement.address,
    requirement.data.id,
    requirement.chain
  )

  const { allowance, isAllowanceLoading, allowanceError } = useAllowance(
    pickedCurrency,
    requirement.address
  )

  const { estimateGasError, onSubmit, isLoading } = usePayFee()

  const isSufficientAllowance = fee && allowance ? fee.lte(allowance) : false

  const {
    coinBalance,
    tokenBalance,
    isLoading: isBalanceLoading,
  } = useBalance(pickedCurrency, Chains[requirement?.chain])

  const pickedCurrencyIsNative =
    pickedCurrency === RPC[requirement?.chain]?.nativeCurrency?.symbol

  const isSufficientBalance =
    fee &&
    (coinBalance || tokenBalance) &&
    (pickedCurrencyIsNative ? coinBalance?.gte(fee) : tokenBalance?.gte(fee))

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

  const onClick = () => {
    onSubmit()
    captureEvent("Click: BuyButton (GuildCheckout)", {
      guild: urlName,
    })
  }

  return (
    <Button
      size="lg"
      isDisabled={isDisabled}
      isLoading={isLoading}
      loadingText="Check your wallet"
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={onClick}
    >
      {errorMsg || "Buy pass"}
    </Button>
  )
}

export default BuyButton
