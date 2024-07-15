import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { Collapse, Icon, Tooltip } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import useToken from "hooks/useToken"
import { PiCheck } from "react-icons/pi"
import { PiQuestion } from "react-icons/pi"
import { PiWarning } from "react-icons/pi"
import useVault from "requirements/Payment/hooks/useVault"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useChainId } from "wagmi"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"
import { useRequirementContext } from "../../../RequirementContext"
import useAllowance from "../../hooks/useAllowance"
import { useGuildCheckoutContext } from "../GuildCheckoutContext"

const BuyAllowanceButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const requirement = useRequirementContext<"PAYMENT">()
  const requirementAddress = requirement.address as `0x${string}`

  const requirementChainId = Chains[requirement.chain]
  const { pickedCurrency } = useGuildCheckoutContext()

  const chainId = useChainId()
  const isNativeCurrencyPicked = pickedCurrency === NULL_ADDRESS

  const { data: tokenData } = useToken({
    address: pickedCurrency,
    chainId: Chains[requirement.chain],
    shouldFetch: Boolean(!isNativeCurrencyPicked && Chains[requirement.chain]),
  })

  const nativeCurrency = CHAIN_CONFIG[requirement.chain].nativeCurrency

  const tokenSymbol = isNativeCurrencyPicked
    ? nativeCurrency.symbol
    : tokenData?.symbol
  const tokenName = isNativeCurrencyPicked ? nativeCurrency.name : name

  const { fee, isLoading: isVaultLoading } = useVault(
    requirementAddress,
    requirement.data.id,
    requirement.chain
  )

  const {
    allowance,
    isAllowanceLoading,
    isAllowing,
    allowanceError,
    allowSpendingTokens,
  } = useAllowance(pickedCurrency, requirementAddress)

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
        data-test="buy-allowance-button"
        size="lg"
        colorScheme={allowanceError ? "red" : "blue"}
        isDisabled={isEnoughAllowance}
        isLoading={isVaultLoading || isAllowanceLoading || isAllowing}
        loadingText={
          isVaultLoading || isAllowanceLoading
            ? "Checking allowance"
            : isAllowing
              ? "Allowing"
              : "PiCheck your wallet"
        }
        onClick={onClick}
        w="full"
        leftIcon={
          allowanceError ? (
            <Icon as={PiWarning} />
          ) : isEnoughAllowance ? (
            <Icon as={PiCheck} />
          ) : null
        }
        rightIcon={
          !isEnoughAllowance && (
            <Tooltip
              label={`You have to give the Guild smart contracts permission to use your ${tokenName}. You only have to do this once per token.`}
            >
              <Icon as={PiQuestion} />
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
