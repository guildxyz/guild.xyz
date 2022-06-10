import { Box, Flex, Img } from "@chakra-ui/react"
import LandingSection from "./LandingSection"
import LandingSectionText from "./LandingSectionText"

const PlatformAgnosticCommunities = (): JSX.Element => (
  <LandingSection
    title="Platform-agnostic communities"
    media={
      <Flex justifyContent="end" width="full" bgColor="yellow.500">
        <Box
          position="relative"
          width={{ base: "80%", md: "full" }}
          bgColor="red.500"
        >
          <Img
            w="full"
            minW="full"
            src="/landing/platform-agnostic-communities.png"
            alt="Platform-agnostic communities"
            bgColor="blue.500"
          />

          <Img
            position="absolute"
            left="-30%"
            bottom={0}
            height="90%"
            src="/landing/rocket.svg"
            alt="Rocket"
            bgColor="green.500"
          />
        </Box>
      </Flex>
    }
    content={
      <LandingSectionText>
        Bring your community to your favourite communication platforms, management
        tools or games.
      </LandingSectionText>
    }
  />
)

export default PlatformAgnosticCommunities
