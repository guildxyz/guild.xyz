import { Box, Flex, Img, Text } from "@chakra-ui/react"
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
            left="-30%"
            bottom={0}
            height="90%"
            src="/landing/rocket.svg"
            alt="Rocket"
          />
        </Box>
      </Flex>
    }
    content={
      <Text w="full" fontSize="xl" fontWeight="medium" lineHeight="125%">
        Bring your community <br />
        to your favourite <br />
        communication platfroms, <br />
        management tools or games.
      </Text>
    }
  />
)

export default PlatformAgnosticCommunities
