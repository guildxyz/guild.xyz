import { Collapse, Icon, Tooltip } from "@chakra-ui/react"
import { CHAIN_CONFIG, Chains } from "chains"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Check, Question, Warning } from "phosphor-react"
import useVault from "requirements/Payment/hooks/useVault"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useChainId, useToken } from "wagmi"
import { useRequirementContext } from "../../../RequirementContext"
import useAllowance from "../../hooks/useAllowance"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const BuyAllowanceButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const requirement = useRequirementContext()
  const requirementChainId = Chains[requirement.chain]
  const { pickedCurrency } = useGuildCheckoutContext()

  const chainId = useChainId()
  const isNativeCurrencyPicked = pickedCurrency === NULL_ADDRESS

  const { data: tokenData } = useToken({
    address: pickedCurrency,
    chainId: Chains[requirement.chain],
    enabled: Boolean(!isNativeCurrencyPicked && Chains[requirement.chain]),
  })

  const nativeCurrency = CHAIN_CONFIG[requirement.chain].nativeCurrency

  const tokenSymbol = isNativeCurrencyPicked
    ? nativeCurrency.symbol
    : tokenData?.symbol
  const tokenName = isNativeCurrencyPicked ? nativeCurrency.name : name

  const { fee, isLoading: isVaultLoading } = useVault(
    requirement.address,
    requirement.data.id,
    requirement.chain
  )

  const {
    allowance,
    isAllowanceLoading,
    isAllowing,
    allowanceError,
    allowSpendingTokens,
  } = useAllowance(pickedCurrency, requirement.address)

  const isEnoughAllowance =
    typeof fee === "bigint" && typeof allowance === "bigint"
      ? fee <= allowance
      : false

  const onClick = () => {
    allowSpendingTokens()
    captureEvent("Click: BuyAllowanceButton (GuildCheckout)", {
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
        isLoading={isVaultLoading || isAllowanceLoading || isAllowing}
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
      >
        {allowanceError
          ? "Couldn't fetch allowance"
          : `Allow Guild to use your ${tokenSymbol}`}
      </Button>
    </Collapse>
  )
}

export default BuyAllowanceButton
