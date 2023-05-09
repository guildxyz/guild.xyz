import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains, RPC } from "connectors"
import useBalance from "hooks/useBalance"
import useAllowance from "../../hooks/useAllowance"
import usePrice from "../../hooks/usePrice"
import usePurchaseAsset from "../../hooks/usePurchaseAsset"
import useTokenBuyerContractData from "../../hooks/useTokenBuyerContractData"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const PurchaseButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const { account, chainId } = useWeb3React()
  const { requirement, pickedCurrency, agreeWithTOS } = useGuildCheckoutContext()

  const {
    data: { maxPriceInWei },
    isValidating: isPriceLoading,
    error,
  } = usePrice()

  const tokenBuyerContractData = useTokenBuyerContractData()

  const { allowance, isAllowanceLoading, allowanceError } = useAllowance(
    pickedCurrency,
    tokenBuyerContractData[Chains[chainId]]?.address
  )

  const { onSubmit, isLoading, estimateGasError } = usePurchaseAsset()

  const isSufficientAllowance =
    maxPriceInWei && allowance ? BigNumber.from(maxPriceInWei).lte(allowance) : false

  const {
    coinBalance,
    tokenBalance,
    isLoading: isBalanceLoading,
  } = useBalance(pickedCurrency, Chains[requirement?.chain])

  const pickedCurrencyIsNative =
    pickedCurrency === RPC[Chains[chainId]]?.nativeCurrency.symbol

  const isSufficientBalance =
    maxPriceInWei &&
    (coinBalance || tokenBalance) &&
    (pickedCurrencyIsNative
      ? coinBalance?.gte(BigNumber.from(maxPriceInWei))
      : tokenBalance?.gte(BigNumber.from(maxPriceInWei)))

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

  const onClick = () => {
    onSubmit()
    captureEvent("Click: PurchaseButton (GuildCheckout)", {
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
      {errorMsg || "Purchase"}
    </Button>
  )
}

export default PurchaseButton
