import { useColorModeValue } from "@chakra-ui/react"
import { useGuildCheckoutContext } from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContext"
import usePrice from "../../../hooks/usePrice"
import TokenInfo from "./TokenInfo"

type Props = {
  chainId: number
  address?: `0x${string}`
}

const CurrencyListItem = ({ chainId, address }: Props): JSX.Element => {
  const { setPickedCurrency } = useGuildCheckoutContext()

  const hoverBgColor = useColorModeValue("gray.100", "whiteAlpha.50")

  const {
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    data: { estimatedPriceInSellToken },
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
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      onClick={() => setPickedCurrency(address)}
      chainId={chainId}
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      address={address}
      requiredAmount={estimatedPriceInSellToken}
      isLoading={isValidating}
      error={error}
    />
  )
}

export default CurrencyListItem
