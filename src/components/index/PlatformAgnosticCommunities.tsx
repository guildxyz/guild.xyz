import { Box, Flex, Img } from "@chakra-ui/react"
import LandingSection from "./LandingSection"
import LandingSectionText from "./LandingSectionText"

const PlatformAgnosticCommunities = (): JSX.Element => (
  <LandingSection
    title="Platform-agnostic communities"
    media={
      <Flex>
        <Box ml="auto" width={{ base: "80%", md: "full" }} position="relative">
          <Img
            w="full"
            minW="full"
            src="/landing/platform-agnostic-communities.webp"
            alt="Platform-agnostic communities"
            loading="lazy"
          />

          <Img
            position="absolute"
            left="-30%"
            bottom={0}
            height="90%"
            src="/landing/rocket.svg"
            alt="Rocket"
            loading="lazy"
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
