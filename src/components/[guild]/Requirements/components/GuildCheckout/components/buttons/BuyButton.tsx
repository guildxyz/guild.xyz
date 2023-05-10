import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Chains, RPC } from "connectors"
import useBalance from "hooks/useBalance"
import useToast from "hooks/useToast"
import useHasPaid from "requirements/Payment/hooks/useHasPaid"
import useVault from "requirements/Payment/hooks/useVault"
import fetcher from "utils/fetcher"
import useAllowance from "../../hooks/useAllowance"
import usePayFee from "../../hooks/usePayFee"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const BuyButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()
  const toast = useToast()

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

  // temporary (in it's current form) until POAPs are real roles and there's a capacity attribute
  const handleSubmit = async () => {
    if (requirement?.poapId) {
      const poapLinks = await fetcher(`/assets/poap/links/${requirement.poapId}`)
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
