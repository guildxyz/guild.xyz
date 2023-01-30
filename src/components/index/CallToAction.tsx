import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { CaretRight } from "phosphor-react"
import LandingButton from "./LandingButton"

const CallToAction = (): JSX.Element => {
  const router = useRouter()

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
        bg="url('/landing/bg.svg')"
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
      <LandingButton
        position="relative"
        onClick={() => router.push("/create-guild")}
        colorScheme="DISCORD"
        loadingText={"Check the popup window"}
        mb={3}
        rightIcon={<CaretRight />}
      >
        Create guild
      </LandingButton>
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
