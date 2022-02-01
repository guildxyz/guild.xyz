import {
  HStack,
  Icon,
  Image,
  InputLeftAddon,
  SkeletonCircle,
  Spinner,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { WarningCircle } from "phosphor-react"

type Props = {
  symbol?: string
  isSymbolValidating?: boolean
  isInvalid?: boolean
}

const Symbol = ({ symbol, isSymbolValidating, isInvalid }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <InputLeftAddon
      borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
      fontSize={{ base: "xs", sm: "md" }}
      fontWeight="bold"
      maxW={20}
    >
      {isSymbolValidating ? (
        <HStack px={1} alignContent="center">
          <Spinner size="sm" color="whiteAlpha.400" />
        </HStack>
      ) : symbol?.startsWith("http") || symbol?.startsWith("/") ? (
        <Image
          boxSize={6}
          minW={6}
          minH={6}
          {...(!symbol.includes(".svg") && {
            objectFit: "cover",
            rounded: "full",
          })}
          src={symbol}
          alt={symbol}
          fallback={<SkeletonCircle boxSize={6} />}
        />
      ) : (
        symbol !== "-" && <Text isTruncated>{symbol}</Text>
      )}

      {!isSymbolValidating && isInvalid && (
        <Icon as={WarningCircle} color="red.500" />
      )}
    </InputLeftAddon>
  )
}
export default Symbol
