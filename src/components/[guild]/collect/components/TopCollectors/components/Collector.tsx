import { Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/useResolveAddress"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
}

const Collector = ({ address }: Props): JSX.Element => {
  const domain = useResolveAddress(address)

  if (!address) return null

  return (
    <VStack spacing={1} opacity="0.5">
      <GuildAvatar address={address} size={{ base: 6, sm: 7, md: 8 }} />
      <Text as="span" fontWeight="semibold" fontSize="sm" maxW="full" noOfLines={1}>
        {domain ?? shortenHex(address, 3)}
      </Text>
    </VStack>
  )
}

const CollectorSkeleton = () => (
  <VStack spacing={1}>
    <SkeletonCircle boxSize={{ base: 5, md: 7 }} />
    <Skeleton w="full" h={3} />
  </VStack>
)

export default Collector
export { CollectorSkeleton }
