import { HStack, Img, InputLeftAddon, Spinner, Text } from "@chakra-ui/react"

type Props = {
  symbol?: string
  isSymbolValidating?: boolean
}

const Symbol = ({ symbol, isSymbolValidating }: Props): JSX.Element => (
  <InputLeftAddon
    borderColor="gray.600"
    fontSize={{ base: "xs", sm: "md" }}
    fontWeight="bold"
  >
    {symbol === undefined && isSymbolValidating ? (
      <HStack px={4} alignContent="center">
        <Spinner size="sm" color="whiteAlpha.400" />
      </HStack>
    ) : symbol?.startsWith("http") || symbol?.startsWith("/") ? (
      <Img boxSize={6} minW={6} minH={6} src={symbol} />
    ) : (
      <Text isTruncated>{symbol}</Text>
    )}
  </InputLeftAddon>
)

export default Symbol
