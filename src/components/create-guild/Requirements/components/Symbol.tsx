import { HStack, Icon, Img, InputLeftAddon, Spinner, Text } from "@chakra-ui/react"
import { WarningCircle } from "phosphor-react"

type Props = {
  symbol?: string
  isSymbolValidating?: boolean
  isInvalid?: boolean
}

const Symbol = ({ symbol, isSymbolValidating, isInvalid }: Props): JSX.Element => (
  <InputLeftAddon
    borderColor="gray.600"
    fontSize={{ base: "xs", sm: "md" }}
    fontWeight="bold"
  >
    {symbol === undefined && symbol !== "-" && isSymbolValidating ? (
      <HStack px={4} alignContent="center">
        <Spinner size="sm" color="whiteAlpha.400" />
      </HStack>
    ) : symbol?.startsWith("http") || symbol?.startsWith("/") ? (
      <Img boxSize={6} minW={6} minH={6} src={symbol} />
    ) : (
      <Text isTruncated>{symbol}</Text>
    )}

    {!isSymbolValidating && isInvalid && <Icon as={WarningCircle} color="red.500" />}
  </InputLeftAddon>
)

export default Symbol
