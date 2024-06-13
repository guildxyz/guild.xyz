import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import useTokenBalance from "hooks/useTokenBalance"
import { NULL_ADDRESS, TOKEN_BUYER_CONTRACTS } from "utils/guildCheckout/constants"
import { useAccount, useBalance } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { useRequirementContext } from "../../../RequirementContext"
import useAllowance from "../../hooks/useAllowance"
import usePrice from "../../hooks/usePrice"
import usePurchaseAsset from "../../hooks/usePurchaseAsset"
import { useGuildCheckoutContext } from "../GuildCheckoutContext"

const PurchaseButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const { isConnected, address, chainId } = useAccount()

  const requirement = useRequirementContext()
  const { pickedCurrency, agreeWithTOS } = useGuildCheckoutContext()

  const {
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    data: { maxPriceInWei },
    isValidating: isPriceLoading,
    error,
  } = usePrice()

  const { allowance, isAllowanceLoading, allowanceError } = useAllowance(
    pickedCurrency,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    TOKEN_BUYER_CONTRACTS[Chains[chainId]]?.address
  )

  const { onSubmitTransaction, isLoading, isPreparing, estimatedGas } =
    usePurchaseAsset()

  const isSufficientAllowance =
    typeof maxPriceInWei === "bigint" && typeof allowance === "bigint"
      ? maxPriceInWei <= allowance
      : false

  const pickedCurrencyIsNative = pickedCurrency === NULL_ADDRESS

  const { data: coinBalanceData, isLoading: isCoinBalanceLoading } = useBalance({
    address,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    chainId: Chains[requirement?.chain],
  })
  const { data: tokenBalanceData, isLoading: isTokenBalanceLoading } =
    useTokenBalance({
      token: pickedCurrency,
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      chainId: Chains[requirement?.chain],
      shouldFetch: !pickedCurrencyIsNative,
    })

  const isBalanceLoading = isCoinBalanceLoading || isTokenBalanceLoading

  const isSufficientBalance =
    typeof maxPriceInWei === "bigint" &&
    (coinBalanceData || tokenBalanceData) &&
    (pickedCurrencyIsNative
      ? // @ts-expect-error TODO: fix this error originating from strictNullChecks
        coinBalanceData?.value >= maxPriceInWei
      : // @ts-expect-error TODO: fix this error originating from strictNullChecks
        tokenBalanceData?.value >= maxPriceInWei)

  const errorMsg =
    (error && "Couldn't calculate price") ??
    (!estimatedGas && "Couldn't estimate gas") ??
    (isConnected && !isSufficientBalance && "Insufficient balance")

  const isDisabled =
    !isConnected ||
    error ||
    !agreeWithTOS ||
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    Chains[chainId] !== requirement.chain ||
    (!pickedCurrencyIsNative &&
      (isPriceLoading ||
        isAllowanceLoading ||
        allowanceError ||
        !isSufficientAllowance)) ||
    isBalanceLoading ||
    !isSufficientBalance ||
    isPreparing ||
    !!errorMsg

  const onClick = () => {
    onSubmitTransaction()
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
