import { Icon, Spinner, Tooltip } from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import useAllowance from "components/[guild]/Requirements/components/GuildCheckout/hooks/useAllowance"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { Check, Question, Warning } from "phosphor-react"
import { TOKEN_BUYER_CONTRACT } from "utils/guildCheckout/constants"
import useAllowSpendingTokens from "../../hooks/useAllowSpendingToken"
import usePrice from "../../hooks/usePrice"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const AllowanceButton = (): JSX.Element => {
  const { pickedCurrency, requirement } = useGuildCheckoutContext()
  const requirementChainId = Chains[requirement.chain]

  const { chainId } = useWeb3React()

  const {
    data: { symbol, name },
  } = useTokenData(requirement.chain, pickedCurrency)
  const nativeCurrency = RPC[Chains[chainId]]?.nativeCurrency
  const isNativeCurrencyPicked = pickedCurrency === nativeCurrency?.symbol

  const tokenSymbol = isNativeCurrencyPicked ? nativeCurrency.symbol : symbol
  const tokenName = isNativeCurrencyPicked ? nativeCurrency.name : name

  const { data: priceData, isValidating: isPriceLoading } = usePrice()
  const { allowance, isAllowanceLoading, allowanceError } = useAllowance(
    pickedCurrency,
    TOKEN_BUYER_CONTRACT
  )

  const isEnoughAllowance =
    priceData?.priceInWei && allowance
      ? BigNumber.from(priceData.priceInWei).lte(allowance)
      : false

  const { onSubmit, isLoading } = useAllowSpendingTokens(
    pickedCurrency,
    TOKEN_BUYER_CONTRACT
  )

  if (!pickedCurrency || chainId !== requirementChainId || isNativeCurrencyPicked)
    return null

  return (
    <CardMotionWrapper>
      <Button
        size="xl"
        colorScheme={allowanceError ? "red" : "blue"}
        isDisabled={
          isPriceLoading || isAllowanceLoading || allowanceError || isEnoughAllowance
        }
        isLoading={isPriceLoading || isAllowanceLoading || isLoading}
        loadingText={
          isPriceLoading || isAllowanceLoading
            ? "Checking allowance"
            : "Check your wallet"
        }
        onClick={onSubmit}
        w="full"
        leftIcon={
          isPriceLoading || isAllowanceLoading ? (
            <Spinner />
          ) : allowanceError ? (
            <Icon as={Warning} />
          ) : isEnoughAllowance ? (
            <Icon as={Check} />
          ) : null
        }
        rightIcon={
          !isEnoughAllowance && (
            <Tooltip
              label={`You have to give the Guild smart contracts permission to use your ${tokenName}. You only have to do this once per token.`}
            >
              <Icon as={Question} />
            </Tooltip>
          )
        }
      >
        {allowanceError
          ? "Couldn't fetch allowance"
          : `Allow Guild to use your ${tokenSymbol}`}
      </Button>
    </CardMotionWrapper>
  )
}

export default AllowanceButton
