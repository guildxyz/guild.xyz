import { Box, HStack, Img, Spinner, Text, useColorMode } from "@chakra-ui/react"

type Props = {
  symbol?: string
  isSymbolValidating?: boolean
}

const Symbol = ({ symbol, isSymbolValidating }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Box
      bgColor={colorMode === "dark" ? "gray.800" : "gray.200"}
      h={10}
      maxW={20}
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
      ) : symbol?.startsWith("http") ? (
        <Img mt={2} boxSize={6} minW={6} minH={6} src={symbol} />
      ) : (
        <Text isTruncated>{symbol}</Text>
      )}
    </Box>
  )
}

export default Symbol
