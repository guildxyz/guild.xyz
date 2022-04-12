import { Box, Flex, Img, Text, VStack } from "@chakra-ui/react"
import LandingSection from "./LandingSection"

const TokenBasedMembership = (): JSX.Element => (
  <LandingSection
    flipped
    title="Token-based membership"
    photo={
      <Flex justifyContent="end">
        <Box position="relative" width="full">
          <Img
            width="full"
            src="/landing/token-based-membership.png"
            alt="Token-based membership"
          />

          <Img
            position="absolute"
            right="15%"
            bottom={{ base: -12, md: -16 }}
            width={56}
            maxW="40%"
            src="/landing/bulldog.png"
            alt="Bulldog"
          />
        </Box>
      </Flex>
    }
    content={
      <VStack spacing={8} alignItems={{ base: "center", md: "start" }}>
        <Text fontSize="xl" fontWeight="medium" lineHeight="125%">
          {`Create exclusive levels in your \ncommunity and manage them \nwith blockchain assets.`}
        </Text>

        <Text>Fun fact: You can set allowlists or guest passes too</Text>
      </VStack>
    }
  />
)

export default TokenBasedMembership
