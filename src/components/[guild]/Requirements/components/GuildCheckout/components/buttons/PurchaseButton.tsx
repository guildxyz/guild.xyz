import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Chains, RPC } from "connectors"
import useBalance from "hooks/useBalance"
import { TOKEN_BUYER_CONTRACT } from "utils/guildCheckout/constants"
import useAllowance from "../../hooks/useAllowance"
import usePrice from "../../hooks/usePrice"
import usePurchaseAsset from "../../hooks/usePurchaseAsset"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const PurchaseButton = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const { requirement, pickedCurrency, agreeWithTOS } = useGuildCheckoutContext()

  const {
    data: { priceInWei },
    isValidating: isPriceLoading,
    error,
  } = usePrice()
  const { allowance, isAllowanceLoading, allowanceError } = useAllowance(
    pickedCurrency,
    TOKEN_BUYER_CONTRACT[chainId]
  )

  const { onSubmit, isLoading, estimateGasError } = usePurchaseAsset()

  const isSufficientAllowance =
    priceInWei && allowance ? BigNumber.from(priceInWei).lte(allowance) : false

  const {
    coinBalance,
    tokenBalance,
    isLoading: isBalanceLoading,
  } = useBalance(pickedCurrency, Chains[requirement?.chain])

  const pickedCurrencyIsNative =
    pickedCurrency !== RPC[Chains[chainId]].nativeCurrency.symbol

  const isSufficientBalance =
    priceInWei &&
    coinBalance &&
    tokenBalance &&
    (pickedCurrencyIsNative
      ? coinBalance.lt(priceInWei)
      : tokenBalance.lt(priceInWei))

  const isDisabled =
    error ||
    estimateGasError ||
    !agreeWithTOS ||
    Chains[chainId] !== requirement.chain ||
    (pickedCurrencyIsNative &&
      (isPriceLoading ||
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
      isLoading={isLoading}
      loadingText="Check your wallet"
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={onSubmit}
      data-dd-action-name="PurchaseButton (GuildCheckout)"
    >
      {errorMsg || "Purchase"}
    </Button>
  )
}

export default PurchaseButton
