import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import Button from "components/common/Button"

const CallToAction = (): JSX.Element => (
  <Flex
    position="relative"
    direction="column"
    alignItems="center"
    justifyContent="center"
    px={{ base: 8, lg: 10 }}
    w="full"
    h="80vh"
  >
    <Box
      position="absolute"
      inset={0}
      bgImage="url('/guildGuard/bg.svg')"
      bgSize={{ base: "cover", lg: "100%" }}
      bgPosition="top center"
      bgRepeat="repeat-x"
      opacity={0.075}
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
      colorScheme="DISCORD"
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

export default CallToAction
