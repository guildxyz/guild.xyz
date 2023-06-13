import { Icon, Text, VStack } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import { Crown } from "phosphor-react"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
  index?: number
}

const topColors: [string, string, string] = ["yellow.500", "gray.400", "orange.400"]

const Minter = ({ address, index }: Props): JSX.Element => {
  const domain = useResolveAddress(address)

  if (!address) return null

  return (
    <VStack
      spacing={2}
      pos="relative"
      opacity="0.5"
      transition="opacity .1s"
      _hover={{ opacity: 1 }}
    >
      <GuildAvatar address={address} size={{ base: 6, md: 8 }} />
      <Text
        fontFamily="display"
        fontWeight="semibold"
        fontSize="sm"
        noOfLines={1}
        maxW="full"
        title={domain || address}
      >
        {domain || `${shortenHex(address, 3)}`}
      </Text>

      {index < 3 && (
        <Icon
          position="absolute"
          top="-2"
          right="0"
          m="0 !important"
          color={topColors[index]}
          as={Crown}
          weight="fill"
        />
      )}
    </VStack>
  )
}

export default Minter
