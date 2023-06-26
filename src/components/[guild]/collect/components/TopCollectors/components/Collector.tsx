import { Flex, SkeletonCircle, Text, VStack } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
}

const Collector = ({ address }: Props): JSX.Element => {
  const domain = useResolveAddress(address)

  if (!address) return null

  return (
    <VStack spacing={1}>
      <Flex
        justifyContent="center"
        opacity="0.5"
        transition="opacity .1s"
        _hover={{ opacity: 1 }}
      >
        <GuildAvatar address={address} size={{ base: 4, md: 6 }} />
      </Flex>
      <Text as="span" fontWeight="semibold" fontSize="xs" maxW="full" noOfLines={1}>
        {domain ?? shortenHex(address, 3)}
      </Text>
    </VStack>
  )
}

const CollectorSkeleton = () => <SkeletonCircle boxSize={{ base: 8, md: 10 }} />

export default Collector
export { CollectorSkeleton }
