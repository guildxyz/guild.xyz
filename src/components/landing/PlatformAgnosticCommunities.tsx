import { Box, Flex, Img } from "@chakra-ui/react"
import LandingSection from "./LandingSection"

const PlatformAgnosticCommunities = (): JSX.Element => (
  <LandingSection
    title="Platform-agnostic communities"
    photo={
      <Flex justifyContent="end" width="full">
        <Box position="relative" width={{ base: "80%", md: "full" }}>
          <Img
            w="full"
            src="/landing/platform-agnostic-communities.png"
            alt="Platform-agnostic communities"
          />

          <Img
            position="absolute"
            left="-40%"
            bottom={0}
            height="full"
            src="/landing/rocket.png"
            alt="Rocket"
          />
        </Box>
      </Flex>
    }
    content={`Bring your community with\n yourself to favourite\n communication platfroms, \nmanagement tools or games.`}
  />
)

export default PlatformAgnosticCommunities
