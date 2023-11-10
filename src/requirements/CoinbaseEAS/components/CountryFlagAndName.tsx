import { HStack, Img, Text, useColorModeValue } from "@chakra-ui/react"
import { countryCodes } from "requirements/CoinbaseEAS/countryCodes"

type Props = {
  code: string
}

const CountryFlagAndName = ({ code }: Props) => {
  const bg = useColorModeValue("blackAlpha.100", "blackAlpha.300")
  const src = `https://flagcdn.com/20x15/${code.toLowerCase()}.webp`
  const countryName =
    countryCodes.find((country) => country.alpha2 === code)?.name ??
    "Unknown country"

  return (
    <HStack
      display="inline-flex"
      mx={1}
      px={1.5}
      py={0.5}
      bgColor={bg}
      borderRadius="sm"
      fontSize="sm"
      maxW="max-content"
    >
      <Img src={src} w="16px" h="12px" alt={countryName} />
      <Text as="span">{countryName}</Text>
    </HStack>
  )
}
export default CountryFlagAndName
