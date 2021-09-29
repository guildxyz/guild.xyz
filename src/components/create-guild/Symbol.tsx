import { Box, HStack, Spinner } from "@chakra-ui/react"

type Props = {
  symbol?: string
  isSymbolValidating?: boolean
}

const Symbol = ({ symbol, isSymbolValidating }: Props): JSX.Element => (
  <Box
    bgColor="gray.800"
    h={10}
    lineHeight={10}
    px={2}
    mr={1}
    borderRadius="xl"
    fontSize={{ base: "xs", sm: "md" }}
    fontWeight="bold"
  >
    {symbol === undefined && isSymbolValidating ? (
      <HStack px={4} h={10} alignContent="center">
        <Spinner size="sm" color="whiteAlpha.400" />
      </HStack>
    ) : (
      symbol
    )}
  </Box>
)

export default Symbol
