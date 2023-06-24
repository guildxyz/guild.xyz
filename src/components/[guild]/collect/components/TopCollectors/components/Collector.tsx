import { Flex, SkeletonCircle, Tooltip } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/resolving/useResolveAddress"

type Props = {
  address: string
}

const Collector = ({ address }: Props): JSX.Element => {
  const domain = useResolveAddress(address)

  if (!address) return null

  return (
    <Tooltip label={domain || address} fontSize="xs" maxW="max-content" hasArrow>
      <Flex
        justifyContent="center"
        opacity="0.5"
        transition="opacity .1s"
        _hover={{ opacity: 1 }}
        mb={4}
      >
        <GuildAvatar address={address} size={{ base: 6, md: 8 }} />
      </Flex>
    </Tooltip>
  )
}

const CollectorSkeleton = () => <SkeletonCircle boxSize={{ base: 8, md: 10 }} />

export default Collector
export { CollectorSkeleton }
