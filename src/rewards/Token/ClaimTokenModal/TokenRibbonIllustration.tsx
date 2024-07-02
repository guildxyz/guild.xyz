import {
  Center,
  Flex,
  Heading,
  Skeleton,
  Stack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import Image from "next/image"
import { useTokenRewardContext } from "../TokenRewardContext"
import { useClaimableTokens } from "../hooks/useCalculateToken"

const TokenRibbonIllustration = () => {
  const { token, guildPlatform, imageUrl } = useTokenRewardContext()
  const claimableAmount = useClaimableTokens(guildPlatform)

  const gradientColor = useColorModeValue(
    "var(--chakra-colors-gold-100)",
    `var(--chakra-colors-gold-800)`
  )

  return (
    <Stack
      justifyContent={"center"}
      position={"relative"}
      alignItems={"center"}
      mt={8}
      mb={4}
    >
      <Center
        position="relative"
        w="full"
        background={`radial-gradient(circle at bottom, ${gradientColor}, transparent 50%) border-box`}
      >
        <Image
          priority
          src={"/img/cup_without_cup.png"}
          alt="Cup"
          width={175}
          height={155}
          draggable={false}
        />
        <GuildLogo
          pos="absolute"
          top="20px"
          imageUrl={imageUrl}
          size={"66px"}
          borderWidth="5px"
          borderColor="gold.400"
          boxSizing="content-box"
          boxShadow="lg"
        />
      </Center>

      <VStack position={"relative"} mt="-70px">
        <Image
          src={"/img/ribbon.svg"}
          alt="Ribbon"
          priority
          width={300}
          height={70}
          draggable={false}
        />

        <Skeleton isLoaded={!token.isLoading}>
          <Flex
            alignItems={"center"}
            gap={2}
            position={"absolute"}
            top={"50%"}
            left={0}
            justifyContent={"center"}
            style={{ transform: "translateY(-33%)" }}
            width={"full"}
          >
            <Heading
              fontSize={"x-large"}
              fontFamily="display"
              color="white"
              marginTop={"-3px"}
            >
              {claimableAmount} {token.data.symbol}
            </Heading>
          </Flex>
        </Skeleton>
      </VStack>
    </Stack>
  )
}

export default TokenRibbonIllustration
