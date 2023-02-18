import { Collapse, Icon, Tooltip } from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useAllowance from "components/[guild]/Requirements/components/GuildCheckout/hooks/useAllowance"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { Check, Question, Warning } from "phosphor-react"
import { TOKEN_BUYER_CONTRACT } from "utils/guildCheckout/constants"
import usePrice from "../../hooks/usePrice"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const PurchaseAllowanceButton = (): JSX.Element => {
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

  const {
    data: { priceInWei },
    isValidating: isPriceLoading,
  } = usePrice()

  const {
    allowance,
    isAllowanceLoading,
    isAllowing,
    allowanceError,
    onSubmit,
    isLoading,
  } = useAllowance(pickedCurrency, TOKEN_BUYER_CONTRACT[Chains[chainId]])

  const isEnoughAllowance =
    priceInWei && allowance ? BigNumber.from(priceInWei).lte(allowance) : false

  return (
    <Collapse
      in={
        pickedCurrency &&
        chainId === requirementChainId &&
        !isNativeCurrencyPicked &&
        !isEnoughAllowance
      }
    >
      <Button
        size="lg"
        colorScheme={allowanceError ? "red" : "blue"}
        isDisabled={isEnoughAllowance}
        isLoading={isPriceLoading || isAllowanceLoading || isLoading}
        loadingText={
          isPriceLoading || isAllowanceLoading
            ? "Checking allowance"
            : isAllowing
            ? "Allowing"
            : "Check your wallet"
        }
        onClick={onSubmit}
        w="full"
        leftIcon={
          allowanceError ? (
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
        data-dd-action-name="PurchaseAllowanceButton (GuildCheckout)"
      >
        {allowanceError
          ? "Couldn't fetch allowance"
          : `Allow Guild to use your ${tokenSymbol}`}
      </Button>
    </Collapse>
  )
}

export default PurchaseAllowanceButton
