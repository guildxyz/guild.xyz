import { Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/useResolveAddress"
import pluralize from "utils/pluralize"
import shortenHex from "utils/shortenHex"
import useNftRanges from "../../CollectNft/hooks/useNftRanges"

type Props = {
  address: string
  balance?: number
}

const Collector = ({ address, balance }: Props) => {
  const domain = useResolveAddress(address)

  if (!address) return null

  return (
    <VStack spacing={1}>
      <GuildAvatar address={address} size={{ base: 6, sm: 7 }} opacity={0.75} />

      <VStack spacing={0} w="full">
        <Text
          as="span"
          fontWeight="semibold"
          fontSize="sm"
          maxW="full"
          noOfLines={1}
          opacity={0.75}
          title={domain ?? address}
        >
          {domain ?? shortenHex(address, 3)}
        </Text>
        {balance && <CollectorBalance balance={balance} />}
      </VStack>
    </VStack>
  )
}

const CollectorBalance = ({
  balance,
}: { balance: NonNullable<Props["balance"]> }) => {
  const ranges = useNftRanges()

  const maxRangeValue = ranges?.at(-1)?.max ?? 0
  const reversedRanges = [...ranges].reverse()
  const rangeIcon =
    maxRangeValue >= 10 && reversedRanges.find((r) => r.min <= balance)?.icon

  return (
    <Text
      as="span"
      fontWeight="semibold"
      fontSize="xs"
      maxW="full"
      noOfLines={1}
      color="GrayText"
    >
      {`${rangeIcon ? `${rangeIcon} ` : ""}${pluralize(balance, "mint")}`}
    </Text>
  )
}

const CollectorSkeleton = () => (
  <VStack spacing={1}>
    <SkeletonCircle boxSize={{ base: 5, md: 7 }} />
    <Skeleton w="full" h={3} />
    <Skeleton w="full" h={3} />
  </VStack>
)

export { Collector, CollectorSkeleton }
