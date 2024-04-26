import {
  Box,
  Center,
  Flex,
  HStack,
  Heading,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import Card, { useCardBg } from "components/common/Card"
import useMembership from "components/explorer/hooks/useMembership"
import useColorPalette from "hooks/useColorPalette"
import Image from "next/image"
import ClaimTokenButton from "platforms/Token/ClaimTokenButton"
import {
  TokenRewardProvider,
  useTokenRewardContext,
} from "platforms/Token/TokenRewardContext"
import { useClaimableTokens } from "platforms/Token/hooks/useCalculateToken"
import { GuildPlatform } from "types"
import { useTokenRewards } from "../AccessHub/hooks/useAccessedTokens"
import AvailabilityTags from "../RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "../hooks/useGuild"
import LeaderboardAirdropFallbackCard from "./LeaderboardAirdropFallbackCard"

const LeaderboardAirdropCard = () => {
  const { token, guildPlatform } = useTokenRewardContext()
  const modalBg = useCardBg()
  const bgFile = useColorModeValue("bg_light.svg", "bg.svg")
  const gold = useColorPalette("gold", "gold")
  const gradientColor = useColorModeValue(
    gold["--gold-200"],
    `${gold["--gold-700"]}70`
  )
  const headingColor = useColorModeValue(gold["--gold-500"], "default")
  const claimableAmount = useClaimableTokens(guildPlatform)

  const { roles } = useGuild()
  const { roleIds } = useMembership()
  const rolePlatformIds = roles
    ?.flatMap((role) => role.rolePlatforms)
    ?.filter(
      (rp) =>
        rp?.guildPlatformId === guildPlatform.id ||
        rp?.guildPlatform?.id === guildPlatform.id
    )
    .filter((rp) => roleIds?.includes(rp.roleId) || false)
    .map((rp) => rp.id)

  if (claimableAmount <= 0) return null

  return (
    <Card
      border={"2px solid transparent"}
      height={100}
      position={"relative"}
      display="flex"
      flexDirection="row"
      alignItems="center"
      background={`linear-gradient(${modalBg}, ${modalBg}) padding-box, linear-gradient(to bottom, ${gold["--gold-500"]}, ${modalBg}) border-box`}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: `linear-gradient(to top right, ${modalBg} 30%, transparent), url('/landing/${bgFile}')`,
        bgSize: "400px",
        bgRepeat: "no-repeat",
        bgPosition: "top 7px right 7px",
        opacity: "0.07",
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: `url('/img/confetti_overlay.png'), linear-gradient(to right, ${gradientColor}, transparent)`,
        bgSize: "250px",
        bgRepeat: "no-repeat",
        bgPosition: "top 0px left -20px",
        opacity: "1",
        zIndex: "0",
      }}
    >
      <HStack
        spacing={1}
        pl={{ base: "85px", sm: "120px" }}
        pr={6}
        alignItems={"center"}
        w="full"
        zIndex={1}
        position={"relative"}
      >
        <Box
          position={"absolute"}
          left={{ base: "-28px", sm: "0px" }}
          top={{ base: "-25px", sm: "-16px" }}
          zIndex={-1}
        >
          <Image
            priority
            src={"/img/cup.png"}
            alt="Cup"
            width={150}
            height={100}
            draggable={false}
            objectFit="cover"
            style={{ objectPosition: "-30px 0px" }}
          />
        </Box>
        <Stack spacing={0} overflow={"hidden"}>
          <Text
            colorScheme={"gray"}
            fontSize={{ base: "sm" }}
            fontWeight={"medium"}
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
          >
            You're eligible to claim
          </Text>
          <Flex flexDir={"row"} alignItems={"center"} gap={4}>
            <Heading
              fontSize={{ base: "large", sm: "x-large" }}
              fontFamily="display"
              mt={0}
              mb={"4px"}
              color={headingColor}
            >
              {claimableAmount} {token.data.symbol}
            </Heading>
            <HStack gap={1} display={{ lg: "inherit", base: "none" }}>
              <AvailabilityTags
                rolePlatform={roles
                  .flatMap((role) => role.rolePlatforms)
                  .find((rp) => rp.id === rolePlatformIds[0])}
              />
            </HStack>
          </Flex>
        </Stack>

        <ClaimTokenButton
          size={{ base: "sm", sm: "md" }}
          w="auto"
          flexShrink={0}
          ml="auto"
        />
      </HStack>
    </Card>
  )
}

const LeaderboardAirdopSkeleton = () => {
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

const LeaderboardAirdropCardWrapper = ({
  guildPlatform,
}: {
  guildPlatform: GuildPlatform
}) => {
  const accessedTokenRewards = useTokenRewards(true)
  const isAccessed = accessedTokenRewards.find((gp) => gp.id === guildPlatform.id)

  if (!isAccessed)
    return <LeaderboardAirdropFallbackCard guildPlatform={guildPlatform} />

  return (
    <TokenRewardProvider guildPlatform={guildPlatform}>
      <LeaderboardAirdropCard />
    </TokenRewardProvider>
  )
}

export {
  LeaderboardAirdopSkeleton,
  LeaderboardAirdropCardWrapper as LeaderboardAirdropCard,
}
