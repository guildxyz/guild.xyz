import { Icon, SkeletonCircle, Tooltip, VStack } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import { Crown } from "phosphor-react"

type Props = {
  address: string
  index?: number
}

const topColors: [string, string, string] = ["yellow.500", "gray.400", "orange.400"]

const Collector = ({ address, index }: Props): JSX.Element => {
  const domain = useResolveAddress(address)

  if (!address) return null

  return (
    <Tooltip label={domain || address} fontSize="xs" maxW="max-content" hasArrow>
      <VStack
        spacing={1}
        pos="relative"
        opacity="0.5"
        transition="opacity .1s"
        _hover={{ opacity: 1 }}
        mb={4}
      >
        <GuildAvatar address={address} size={{ base: 6, md: 8 }} />

        {index < 3 && (
          <Icon
            position="absolute"
            top="-2"
            right="0"
            m="0 !important"
            color={topColors[index]}
            as={Crown}
            weight="fill"
            boxSize={4}
          />
        )}
      </VStack>
    </Tooltip>
  )
}

const CollectorSkeleton = () => <SkeletonCircle boxSize={{ base: 8, md: 10 }} />

export default Collector
export { CollectorSkeleton }
