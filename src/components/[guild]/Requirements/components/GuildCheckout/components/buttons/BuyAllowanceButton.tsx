import { Collapse, Icon, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { Check, Question, Warning } from "phosphor-react"
import { usePostHog } from "posthog-js/react"
import useVault from "requirements/Payment/hooks/useVault"
import useAllowance from "../../hooks/useAllowance"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const BuyAllowanceButton = (): JSX.Element => {
  const posthog = usePostHog()

  const { pickedCurrency, requirement } = useGuildCheckoutContext()
  const requirementChainId = Chains[requirement.chain]

  const { chainId } = useWeb3React()

  const {
    data: { symbol, name },
  } = useTokenData(requirement.chain, pickedCurrency)
  const nativeCurrency = RPC[requirement?.chain]?.nativeCurrency
  const isNativeCurrencyPicked = pickedCurrency === nativeCurrency?.symbol

  const tokenSymbol = isNativeCurrencyPicked ? nativeCurrency.symbol : symbol
  const tokenName = isNativeCurrencyPicked ? nativeCurrency.name : name

  const {
    data: { fee },
    isValidating: isVaultLoading,
  } = useVault(requirement.address, requirement.data.id, requirement.chain)

  const {
    allowance,
    isAllowanceLoading,
    isAllowing,
    allowanceError,
    onSubmit,
    isLoading,
  } = useAllowance(pickedCurrency, requirement.address)

  const isEnoughAllowance = fee && allowance ? fee.lte(allowance) : false

  const onClick = () => {
    onSubmit()
    posthog.capture("Click: BuyAllowanceButton (GuildCheckout)")
  }

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
        isLoading={isVaultLoading || isAllowanceLoading || isLoading}
        loadingText={
          isVaultLoading || isAllowanceLoading
            ? "Checking allowance"
            : isAllowing
            ? "Allowing"
            : "Check your wallet"
        }
        onClick={onClick}
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
        data-dd-action-name="BuyAllowanceButton (GuildCheckout)"
      >
        {allowanceError
          ? "Couldn't fetch allowance"
          : `Allow Guild to use your ${tokenSymbol}`}
      </Button>
    </Collapse>
  )
}

export default BuyAllowanceButton
