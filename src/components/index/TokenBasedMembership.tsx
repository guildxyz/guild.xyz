import { Box, Icon, Img, Text, VStack } from "@chakra-ui/react"
import { Sparkle } from "phosphor-react"
import LandingSection from "./LandingSection"
import LandingSectionText from "./LandingSectionText"

const TokenBasedMembership = (): JSX.Element => (
  <LandingSection
    flipped
    title="Token-enabled membership"
    media={
      <Box position="relative" width="full">
        <Img
          width="full"
          src="/landing/token-based-membership.webp"
          alt="Token-enabled membership"
          loading="lazy"
        />

        <Img
          position="absolute"
          right="15%"
          bottom={{ base: -8, md: -12 }}
          width={44}
          maxW="40%"
          src="/landing/bunny.svg"
          alt="Bunny"
          loading="lazy"
        />
      </Box>
    }
    content={
      <VStack spacing={8} alignItems={{ base: "center", md: "start" }}>
        <LandingSectionText>
          Create exclusive levels in your community and manage them with blockchain
          assets.
        </LandingSectionText>

        <Text fontWeight={"medium"}>
          <Icon color="yellow.400" as={Sparkle} mb="-2px" /> Fun fact: You can set
          allowlists or guest passes too
        </Text>
      </VStack>
    }
  />
)

export default TokenBasedMembership
