import {
  Center,
  Circle,
  HStack,
  Icon,
  Skeleton,
  SkeletonCircle,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/useResolveAddress"
import { useRouter } from "next/router"
import { Trophy } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import useGuildPlatform from "../hooks/useGuildPlatform"

type Props = {
  address: string
  score: number
  position: number
  isCurrentUser: boolean
  tooltipLabel: string
}

const getTrophyColor = (position: number) => {
  switch (position) {
    case 1:
      return "yellow.500"
    case 2:
      return "gray.400"
    default:
      return "orange.400"
  }
}

const LeaderboardUserCard = ({
  address: addressParam,
  score,
  position,
  isCurrentUser,
  tooltipLabel,
}: Props) => {
  const router = useRouter()

  const resolvedAddress = useResolveAddress(addressParam)
  const positionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const positionBorderColor = useColorModeValue("gray.200", "gray.600")
  const guildAvatarBgColor = useColorModeValue("gray.700", "gray.600")

  const { guildPlatform: pointsPlatform } = useGuildPlatform(
    Number(router.query.pointsId)
  )
  const pointsName = pointsPlatform?.platformGuildData?.name || "points"

  const TrophyIcon =
    position <= 3 ? (
      <Icon
        as={Trophy}
        weight="fill"
        color={getTrophyColor(position)}
        boxSize={{ base: 8, sm: 10 }}
      />
    ) : null

  return (
    <Card {...(isCurrentUser ? { borderWidth: 2, borderColor: "primary.500" } : {})}>
      <HStack spacing={0}>
        <Center
          position="relative"
          minW={{ base: 16, sm: 24 }}
          maxW={{ base: 16, sm: 24 }}
          placeSelf="stretch"
          bgColor={positionBgColor}
          borderRightWidth={1}
          borderRightColor={positionBorderColor}
        >
          {TrophyIcon}
          <Center position={position <= 3 ? "absolute" : "relative"} inset={0}>
            <Text
              mt={position <= 3 ? { base: -1.5, sm: -2 } : 0}
              as="span"
              fontFamily="display"
              fontSize={
                position <= 3
                  ? { base: "sm", sm: "md" }
                  : position < 1000
                  ? { base: "lg", sm: "xl" }
                  : position < 10000
                  ? { base: "md", sm: "lg" }
                  : { base: "xs", sm: "sm" }
              }
              fontWeight="bold"
              letterSpacing="wide"
              color={position <= 3 ? "white" : undefined}
            >
              {`${position <= 3 ? "" : "#"}${position}`}
            </Text>
          </Center>
        </Center>
        <HStack
          spacing={{ base: 2, md: 3 }}
          px={{ base: 4, md: 6 }}
          py={{ base: 5, md: 7 }}
          w="full"
          overflow={"hidden"}
        >
          <Circle size={10} bgColor={guildAvatarBgColor} color="white">
            <GuildAvatar size={5} address={addressParam} />
          </Circle>

          <HStack
            justifyContent={"space-between"}
            w="full"
            overflow={"hidden"}
            spacing={4}
          >
            <Text fontWeight="bold" maxW="full" noOfLines={1}>
              {resolvedAddress ?? shortenHex(addressParam)}
              {isCurrentUser && (
                <Tag ml="2" colorScheme={"primary"}>
                  You
                </Tag>
              )}
            </Text>

            <Tooltip label={tooltipLabel} hasArrow>
              <HStack spacing={{ base: "3px", md: 1 }}>
                <Text fontWeight="bold">{score}</Text>
                <Text as="span" fontWeight="medium" fontSize="sm">
                  {pointsName}
                </Text>
              </HStack>
            </Tooltip>
          </HStack>
        </HStack>
      </HStack>
    </Card>
  )
}

const LeaderboardUserCardSkeleton = () => {
  const positionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const positionBorderColor = useColorModeValue("gray.200", "gray.600")

  return (
    <Card>
      <HStack spacing={0}>
        <Center
          minW={{ base: 16, sm: 24 }}
          maxW={{ base: 16, sm: 24 }}
          placeSelf="stretch"
          bgColor={positionBgColor}
          borderRightWidth={1}
          borderRightColor={positionBorderColor}
        >
          <Skeleton boxSize={{ base: 6, sm: 8 }} />
        </Center>
        <HStack spacing={4} px={{ base: 5, md: 6 }} py={{ base: 5, md: 7 }}>
          <SkeletonCircle boxSize={10} />

          <VStack alignItems="start" spacing={0}>
            <Skeleton w={48} />
            <Skeleton w={24} h={4} />
          </VStack>
        </HStack>
      </HStack>
    </Card>
  )
}

export default LeaderboardUserCard
export { LeaderboardUserCardSkeleton }
