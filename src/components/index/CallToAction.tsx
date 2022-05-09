import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import useDCAuthWithCallback from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuthWithCallback"
import { useRouter } from "next/router"

const CallToAction = (): JSX.Element => {
  const router = useRouter()
  const { callbackWithDCAuth, isAuthenticating } = useDCAuthWithCallback(
    "guilds",
    () => router.push("/create-guild/discord")
  )

  return (
    <Flex
      as="section"
      position="relative"
      direction="column"
      alignItems="center"
      justifyContent="center"
      px={{ base: 8, lg: 10 }}
      w="full"
      h="80vh"
      zIndex={-1}
      sx={{
        transformStyle: "preserve-3d",
      }}
    >
      <Box
        position="absolute"
        inset={0}
        bg="url('/guildGuard/bg.svg')"
        bgSize={{ base: "cover", lg: "calc(100% - 2.25rem) auto" }}
        bgRepeat="no-repeat"
        bgPosition="top center"
        opacity={0.075}
        sx={{
          transform: "translateZ(-1px) scale(1.5)",
        }}
      />
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear-gradient(to bottom, var(--chakra-colors-gray-800) 0%, transparent 40%, transparent 60%, var(--chakra-colors-gray-800))"
      />

      <Heading
        position="relative"
        as="h3"
        mb={8}
        fontFamily="display"
        fontSize={{ base: "3xl", md: "4xl", lg: "6xl" }}
        textAlign="center"
      >
        Start gating your <br />
        community today for free
      </Heading>
      <Button
        position="relative"
        onClick={callbackWithDCAuth}
        isLoading={isAuthenticating}
        colorScheme="DISCORD"
        loadingText={"Check the popup window"}
        mb={3}
        px={{ base: 4, "2xl": 6 }}
        h={{ base: 12, "2xl": 14 }}
        fontFamily="display"
        fontWeight="bold"
        letterSpacing="wide"
        lineHeight="base"
      >
        Add to Discord
      </Button>
      <Text
        position="relative"
        color="gray.450"
        fontFamily="display"
        fontWeight="bold"
        fontSize={{ base: "xs", lg: "sm" }}
      >
        It takes 5 mins
      </Text>
    </Flex>
  )
}

export default CallToAction
