import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { Chains, RPC } from "connectors"
import useBalance from "hooks/useBalance"
import { getTokenBuyerContractData } from "utils/guildCheckout/constants"
import useAllowance from "../../hooks/useAllowance"
import usePrice from "../../hooks/usePrice"
import usePurchaseAsset from "../../hooks/usePurchaseAsset"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const PurchaseButton = (): JSX.Element => {
  const { account, chainId } = useWeb3React()
  const { requirement, pickedCurrency, agreeWithTOS } = useGuildCheckoutContext()

  const {
    data: { priceInWei },
    isValidating: isPriceLoading,
    error,
  } = usePrice()

  const { id } = useGuild()
  const tokenBuyerContractData = getTokenBuyerContractData(id)
  const { allowance, isAllowanceLoading, allowanceError } = useAllowance(
    pickedCurrency,
    tokenBuyerContractData[Chains[chainId]]?.address
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
    pickedCurrency === RPC[Chains[chainId]]?.nativeCurrency.symbol

  const isSufficientBalance =
    priceInWei &&
    (coinBalance || tokenBalance) &&
    (pickedCurrencyIsNative
      ? coinBalance?.gt(BigNumber.from(priceInWei))
      : tokenBalance?.gt(BigNumber.from(priceInWei)))

  const isDisabled =
    !account ||
    error ||
    estimateGasError ||
    !agreeWithTOS ||
    Chains[chainId] !== requirement.chain ||
    (!pickedCurrencyIsNative &&
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
    (account && !isSufficientBalance && "Insufficient balance")

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
