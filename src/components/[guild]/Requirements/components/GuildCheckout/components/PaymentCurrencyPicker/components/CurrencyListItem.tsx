import { useColorModeValue } from "@chakra-ui/react"
import { useGuildCheckoutContext } from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContex"
import useDatadog from "components/_app/Datadog/useDatadog"
import usePrice from "../../../hooks/usePrice"
import TokenInfo from "./TokenInfo"

type Props = {
  chainId: number
  address?: string
}

const CurrencyListItem = ({ chainId, address }: Props): JSX.Element => {
  const { addDatadogAction } = useDatadog()

  const { setPickedCurrency } = useGuildCheckoutContext()

  const hoverBgColor = useColorModeValue("gray.100", "whiteAlpha.50")

  const onClick = () => {
    setPickedCurrency(address)
    addDatadogAction("user picked currency (GuildCheckout)")
  }

  const {
    data: { priceInSellToken },
    isValidating,
    error,
  } = usePrice(address)

  return (
    <TokenInfo
      asMenuItem
      p={4}
      maxW="none"
      bgColor="transparent"
      borderRadius={0}
      fontWeight="normal"
      textAlign="left"
      transition="background-color 0.1s ease"
      _hover={{ bgColor: hoverBgColor }}
      _focusVisible={{ bgColor: hoverBgColor }}
      onClick={onClick}
      chainId={chainId}
      address={address}
      requiredAmount={priceInSellToken}
      isLoading={isValidating}
      error={error}
    />
  )
}

export default CurrencyListItem
