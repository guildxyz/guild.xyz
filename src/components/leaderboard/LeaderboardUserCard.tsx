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
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import dynamic from "next/dynamic"
import Link from "next/link"
import { CaretDown, Trophy } from "phosphor-react"
import {
  DetailedUserLeaderboardData,
  GuildPinMetadata,
  LeaderboardPinData,
} from "types"
import shortenHex from "utils/shortenHex"

const DynamicScoreFormulaPopover = dynamic(() => import("./ScoreFormulaPopover"), {
  ssr: false,
})

const getPinMetadata = (
  pin: LeaderboardPinData | GuildPinMetadata
): GuildPinMetadata =>
  "tokenUri" in pin
    ? JSON.parse(
        Buffer.from(
          pin.tokenUri.replace("data:application/json;base64,", ""),
          "base64"
        ).toString("utf-8")
      )
    : pin

type Props = {
  userLeaderboardData: DetailedUserLeaderboardData
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

const LeaderboardUserCard = ({ userLeaderboardData, position }: Props) => {
  const { account } = useWeb3React()
  const shouldRenderScoreTooltip =
    userLeaderboardData.address?.toLowerCase() === account?.toLowerCase()

  const resolvedAddress = useResolveAddress(userLeaderboardData.address)
  const positionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const positionBorderColor = useColorModeValue("gray.200", "gray.600")
  const guildAvatarBgColor = useColorModeValue("gray.700", "gray.600")
  const fakeTransparentBorderColor = useColorModeValue("white", "gray.700")
  const solidBgColor = useColorModeValue("gray.200", "gray.800")

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
    <Card spacing={4}>
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
                position <= 3 ? { base: "sm", sm: "md" } : { base: "lg", sm: "xl" }
              }
              fontWeight="bold"
              letterSpacing="wide"
            >
              {`${position <= 3 ? "" : "#"}${position}`}
            </Text>
          </Center>
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

              <HStack spacing={1}>
                <Text
                  as="span"
                  colorScheme="gray"
                  textTransform="uppercase"
                  fontWeight="bold"
                  fontSize="xs"
                >{`Score: ${userLeaderboardData.score}`}</Text>

                {shouldRenderScoreTooltip && <DynamicScoreFormulaPopover />}
              </HStack>
            </VStack>
          </HStack>

          <Flex direction="row" alignItems="center">
            {!userLeaderboardData?.pins?.length ? (
              <PinsListSkeleton />
            ) : (
              <>
                {userLeaderboardData.pins.map((pin) => {
                  const pinMetadata = getPinMetadata(pin)

                  return (
                    <Link
                      key={`${pin.chainId}-${pin.tokenId}`}
                      href={pinMetadata.attributes
                        .find((attribute) => attribute.trait_type === "guildId")
                        .value.toString()}
                    >
                      <Circle
                        position="relative"
                        size={8}
                        ml={-3}
                        _first={{ ml: 0 }}
                        borderWidth={2}
                        borderColor={fakeTransparentBorderColor}
                        transition="transform 0.2s ease"
                        _hover={{
                          transform: "translate(0,-0.5rem) scale(1.05)",
                        }}
                        cursor="pointer"
                      >
                        <Img
                          src={pinMetadata.image.replace(
                            "ipfs://",
                            process.env.NEXT_PUBLIC_IPFS_GATEWAY
                          )}
                          alt={pinMetadata.name}
                        />
                      </Circle>
                    </Link>
                  )
                })}
                <Popover>
                  <PopoverTrigger>
                    <Circle
                      position="relative"
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
                        {userLeaderboardData.pins.map((pin) => {
                          const pinMetadata = getPinMetadata(pin)

                          return (
                            <HStack
                              key={`${pin.chainId}-${pin.tokenId}`}
                              justifyContent="space-between"
                            >
                              <HStack>
                                <Img
                                  src={pinMetadata.image.replace(
                                    "ipfs://",
                                    process.env.NEXT_PUBLIC_IPFS_GATEWAY
                                  )}
                                  alt={pinMetadata.name}
                                  boxSize={6}
                                />
                                <Text as="span" fontWeight="medium" fontSize="sm">
                                  {pinMetadata.name}
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
                                  pinMetadata.attributes.find(
                                    (attr) => attr.trait_type === "rank"
                                  ).value
                                }`}
                              </Text>
                            </HStack>
                          )
                        })}
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </>
            )}
          </Flex>
        </Stack>
      </HStack>
    </Card>
  )
}

const LeaderboardUserCardSkeleton = () => {
  const positionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const positionBorderColor = useColorModeValue("gray.200", "gray.600")

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

          <PinsListSkeleton />
        </Stack>
      </HStack>
    </Card>
  )
}

const PinsListSkeleton = () => {
  const fakeTransparentBorderColor = useColorModeValue("white", "gray.700")
  const solidBgColor = useColorModeValue("gray.200", "gray.800")

  return (
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
  )
}

export default LeaderboardUserCard
export { LeaderboardUserCardSkeleton }
