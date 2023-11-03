import { Collapse, Icon, Tooltip } from "@chakra-ui/react"
import { CHAIN_CONFIG, Chains } from "chains"
import useAllowance from "components/[guild]/Requirements/components/GuildCheckout/hooks/useAllowance"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import useTokenData from "hooks/useTokenData"
import { Check, Question, Warning } from "phosphor-react"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useChainId } from "wagmi"
import { useRequirementContext } from "../../../RequirementContext"
import usePrice from "../../hooks/usePrice"
import useTokenBuyerContractData from "../../hooks/useTokenBuyerContractData"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const PurchaseAllowanceButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const requirement = useRequirementContext()
  const requirementChainId = Chains[requirement.chain]
  const { pickedCurrency } = useGuildCheckoutContext()

  const chainId = useChainId()

  const {
    data: { symbol, name },
  } = useTokenData(requirement.chain, pickedCurrency)
  const nativeCurrency = CHAIN_CONFIG[Chains[chainId]]?.nativeCurrency
  const isNativeCurrencyPicked = pickedCurrency === NULL_ADDRESS

  const tokenSymbol = isNativeCurrencyPicked ? nativeCurrency.symbol : symbol
  const tokenName = isNativeCurrencyPicked ? nativeCurrency.name : name

  const {
    data: { maxPriceInWei },
    isValidating: isPriceLoading,
  } = usePrice()

  const tokenBuyerContractData = useTokenBuyerContractData()

  const {
    allowance,
    isAllowanceLoading,
    isAllowing,
    allowanceError,
    allowSpendingTokens,
  } = useAllowance(pickedCurrency, tokenBuyerContractData[Chains[chainId]]?.address)

  const isEnoughAllowance =
    typeof maxPriceInWei === "bigint" && typeof allowance === "bigint"
      ? maxPriceInWei <= allowance
      : false

  const onClick = () => {
    allowSpendingTokens()
    captureEvent("Click: PurchaseAllowanceButton (GuildCheckout)", {
      guild: urlName,
    })
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
        isLoading={isPriceLoading || isAllowanceLoading || isAllowing}
        loadingText={
          isPriceLoading || isAllowanceLoading
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
      >
        {allowanceError
          ? "Couldn't fetch allowance"
          : `Allow Guild to use your ${tokenSymbol}`}
      </Button>
    </Collapse>
  )
}

export default PurchaseAllowanceButton
