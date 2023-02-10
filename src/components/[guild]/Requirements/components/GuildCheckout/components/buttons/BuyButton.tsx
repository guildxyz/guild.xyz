import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Chains, RPC } from "connectors"
import useBalance from "hooks/useBalance"
import useVault from "requirements/Payment/hooks/useVault"
import { FEE_COLLECTOR_CONTRACT } from "utils/guildCheckout/constants"
import useAllowance from "../../hooks/useAllowance"
import usePayFee from "../../hooks/usePayFee"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const BuyButton = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const { requirement, pickedCurrency, agreeWithTOS } = useGuildCheckoutContext()

  const {
    data: { fee },
    isValidating: isVaultLoading,
    error,
  } = useVault(requirement.data.id, requirement.chain)

  const { allowance, isAllowanceLoading, allowanceError } = useAllowance(
    pickedCurrency,
    FEE_COLLECTOR_CONTRACT[Chains[chainId]]
  )

  const { estimateGasError } = usePayFee()

  const isSufficientAllowance = fee && allowance ? fee.lte(allowance) : false

  const {
    coinBalance,
    tokenBalance,
    isLoading: isBalanceLoading,
  } = useBalance(pickedCurrency, Chains[requirement?.chain])

  const pickedCurrencyIsNative =
    pickedCurrency === RPC[Chains[chainId]].nativeCurrency.symbol

  const isSufficientBalance =
    fee &&
    (coinBalance || tokenBalance) &&
    (pickedCurrencyIsNative ? coinBalance?.gt(fee) : tokenBalance?.gt(fee))

  const isDisabled =
    error ||
    estimateGasError ||
    !agreeWithTOS ||
    Chains[chainId] !== requirement.chain ||
    (!pickedCurrencyIsNative &&
      (isVaultLoading ||
        isAllowanceLoading ||
        allowanceError ||
        !isSufficientAllowance)) ||
    isBalanceLoading ||
    !isSufficientBalance

  const errorMsg =
    (error && "Couldn't calculate price") ??
    (estimateGasError &&
      (estimateGasError?.data?.message?.includes("insufficient")
        ? "Insufficient funds for gas"
        : "Couldn't estimate gas")) ??
    (!isSufficientBalance && "Insufficient balance")

  return (
    <Button
      size="lg"
      isDisabled={isDisabled}
      // isLoading={isLoading}
      loadingText="Check your wallet"
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      // onClick={onSubmit}
      data-dd-action-name="BuyButton (GuildCheckout)"
    >
      {errorMsg || "Buy pass"}
    </Button>
  )
}

export default BuyButton
