import {
  Center,
  Circle,
  Flex,
  HStack,
  Icon,
  Img,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import { Trophy } from "phosphor-react"
import { UserLeaderboardData } from "types"
import shortenHex from "utils/shortenHex"

type Props = {
  userLeaderboardData: UserLeaderboardData
  position: number
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

const LeaderBoardCard = ({ userLeaderboardData, position }: Props) => {
  const resolvedAddress = useResolveAddress(userLeaderboardData.address)
  const positionBgColor = useColorModeValue("gray.50", "blackAlpha.400")
  const positionBorderColor = useColorModeValue("gray.200", "transparent")
  const guildAvatarBgColor = useColorModeValue("gray.700", "gray.600")
  const pinBorderColor = useColorModeValue("white", "gray.700")

  const TrophyIcon =
    position <= 3 ? (
      <Icon as={Trophy} weight="fill" color={getTrophyColor(position)} />
    ) : null

  return (
    <Card spacing={4}>
      <HStack spacing={0}>
        <Center
          minW={{ base: 16, sm: 24 }}
          maxW={{ base: 16, sm: 24 }}
          placeSelf="stretch"
          bgColor={positionBgColor}
          borderRightWidth={1}
          borderRightColor={positionBorderColor}
        >
          <Text
            as="span"
            fontFamily="display"
            fontSize={{ base: "lg", sm: "2xl" }}
            fontWeight="bold"
            letterSpacing="wide"
          >
            {`#${position}`}
          </Text>
        </Center>
        <Stack
          w="full"
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          px={{ base: 5, md: 6 }}
          py={{ base: 6, md: 7 }}
        >
          <HStack spacing={4}>
            <Circle size={10} bgColor={guildAvatarBgColor} color="white">
              <GuildAvatar size={5} address={userLeaderboardData.address} />
            </Circle>

            <VStack alignItems="start" spacing={0}>
              <HStack>
                <Text
                  as="span"
                  fontFamily="display"
                  fontSize="md"
                  fontWeight="bold"
                  letterSpacing="wide"
                  maxW="full"
                  noOfLines={1}
                >
                  {resolvedAddress ?? shortenHex(userLeaderboardData.address)}
                </Text>
                {TrophyIcon}
              </HStack>

              <Text
                as="span"
                colorScheme="gray"
                textTransform="uppercase"
                fontWeight="bold"
                fontSize="xs"
              >{`Score: ${Math.ceil(userLeaderboardData.score * 100)}`}</Text>
            </VStack>
          </HStack>

          <Flex direction="row">
            {userLeaderboardData.pins.map((pin) => (
              <Circle
                key={`${pin.chainId}-${pin.tokenId}`}
                size={8}
                ml={-3}
                _first={{ ml: 0 }}
                borderWidth={2}
                borderColor={pinBorderColor}
              >
                <Img
                  src={pin.metadata.image.replace(
                    "ipfs://",
                    process.env.NEXT_PUBLIC_IPFS_GATEWAY
                  )}
                  alt={pin.metadata.name}
                />
              </Circle>
            ))}
          </Flex>
        </Stack>
      </HStack>
    </Card>
  )
}

export default LeaderBoardCard
