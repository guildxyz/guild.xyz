import {
  Center,
  Circle,
  Flex,
  HStack,
  Icon,
  IconButton,
  Img,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import { CaretDown, Trophy } from "phosphor-react"
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

const LeaderboardCard = ({ userLeaderboardData, position }: Props) => {
  const resolvedAddress = useResolveAddress(userLeaderboardData.address)
  const positionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const positionBorderColor = useColorModeValue("gray.200", "gray.600")
  const guildAvatarBgColor = useColorModeValue("gray.700", "gray.600")
  const fakeTransparentBorderColor = useColorModeValue("white", "gray.700")
  const solidBgColor = useColorModeValue("gray.200", "gray.800")

  const TrophyIcon =
    position <= 3 ? (
      <Icon as={Trophy} weight="fill" color={getTrophyColor(position)} boxSize={3} />
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
            <Circle
              size={10}
              bgColor={guildAvatarBgColor}
              color="white"
              position="relative"
            >
              <GuildAvatar size={5} address={userLeaderboardData.address} />

              {TrophyIcon && (
                <Circle
                  position="absolute"
                  right={-1}
                  bottom={-0.5}
                  size={5}
                  borderWidth={2}
                  borderColor={fakeTransparentBorderColor}
                  bgColor={solidBgColor}
                >
                  {TrophyIcon}
                </Circle>
              )}
            </Circle>

            <VStack alignItems="start" spacing={0}>
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

              <Text
                as="span"
                colorScheme="gray"
                textTransform="uppercase"
                fontWeight="bold"
                fontSize="xs"
              >{`Score: ${Math.ceil(userLeaderboardData.score * 100)}`}</Text>
            </VStack>
          </HStack>

          <Flex direction="row" alignItems="center">
            {userLeaderboardData.pins.map((pin) => (
              <Circle
                key={`${pin.chainId}-${pin.tokenId}`}
                size={8}
                ml={-3}
                _first={{ ml: 0 }}
                borderWidth={2}
                borderColor={fakeTransparentBorderColor}
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

            <Popover>
              <PopoverTrigger>
                <Circle
                  ml={-3}
                  size={8}
                  bgColor={solidBgColor}
                  borderWidth={2}
                  borderColor={fakeTransparentBorderColor}
                >
                  <IconButton
                    aria-label="View pins"
                    icon={<CaretDown />}
                    boxSize={7}
                    minW="none"
                    minH="none"
                    rounded="full"
                    borderWidth={2}
                    borderColor="transparent"
                    variant="ghost"
                    size="xs"
                  />
                </Circle>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton rounded="full" />
                <PopoverHeader fontWeight="bold" fontSize="sm">
                  Guild Pins
                </PopoverHeader>
                <PopoverBody>
                  <Stack>
                    {userLeaderboardData.pins.map((pin) => (
                      <HStack
                        key={`${pin.chainId}-${pin.tokenId}`}
                        justifyContent="space-between"
                      >
                        <HStack>
                          <Img
                            src={pin.metadata.image.replace(
                              "ipfs://",
                              process.env.NEXT_PUBLIC_IPFS_GATEWAY
                            )}
                            alt={pin.metadata.name}
                            boxSize={6}
                          />
                          <Text as="span" fontWeight="medium" fontSize="sm">
                            {pin.metadata.name}
                          </Text>
                        </HStack>

                        <Text
                          as="span"
                          fontWeight="bold"
                          fontSize="x-small"
                          colorScheme="gray"
                          textTransform="uppercase"
                        >
                          {`Rank: ${
                            pin.metadata.attributes.find(
                              (attr) => attr.trait_type === "rank"
                            ).value
                          }`}
                        </Text>
                      </HStack>
                    ))}
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </Stack>
      </HStack>
    </Card>
  )
}

const LeaderboardCardSkeleton = () => {
  const positionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const positionBorderColor = useColorModeValue("gray.200", "gray.600")
  const fakeTransparentBorderColor = useColorModeValue("white", "gray.700")
  const solidBgColor = useColorModeValue("gray.200", "gray.800")

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
          <Skeleton boxSize={{ base: 6, sm: 8 }} />
        </Center>
        <Stack
          w="full"
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          px={{ base: 5, md: 6 }}
          py={{ base: 6, md: 7 }}
        >
          <HStack spacing={4}>
            <SkeletonCircle boxSize={10} />

            <VStack alignItems="start" spacing={0}>
              <Skeleton w={48} />
              <Skeleton w={24} h={4} />
            </VStack>
          </HStack>

          <Flex direction="row" alignItems="center">
            {[...Array(3)].map((_, index) => (
              <Circle
                key={index}
                position="relative"
                size={8}
                ml={-3}
                _first={{ ml: 0 }}
                borderWidth={2}
                borderColor={fakeTransparentBorderColor}
                bgColor={solidBgColor}
              >
                <SkeletonCircle boxSize={7} />
              </Circle>
            ))}
          </Flex>
        </Stack>
      </HStack>
    </Card>
  )
}

export default LeaderboardCard
export { LeaderboardCardSkeleton }
