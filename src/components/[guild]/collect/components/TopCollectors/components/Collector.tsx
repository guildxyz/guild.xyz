import { Icon, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import { Crown } from "phosphor-react"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
  index?: number
}

const topColors: [string, string, string] = ["yellow.500", "gray.400", "orange.400"]

const Collector = ({ address, index }: Props): JSX.Element => {
  const domain = useResolveAddress(address)

  if (!address) return null

  return (
    <VStack
      spacing={1}
      pos="relative"
      opacity="0.5"
      transition="opacity .1s"
      _hover={{ opacity: 1 }}
      mb={4}
    >
      <GuildAvatar address={address} size={{ base: 3, md: 4 }} />
      <Text
        wordBreak="revert"
        fontWeight="semibold"
        letterSpacing={-0.5}
        fontSize="x-small"
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
          boxSize={3}
        />
      )}
    </VStack>
  )
}

const CollectorSkeleton = () => (
  <VStack spacing={2} pos="relative">
    <SkeletonCircle boxSize={{ base: 8, md: 10 }} />
    <Skeleton w="full" h={4} />
  </VStack>
)

export default Collector
export { CollectorSkeleton }
