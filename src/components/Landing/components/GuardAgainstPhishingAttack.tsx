import { Box, Flex, Img, Text } from "@chakra-ui/react"
import LandingSection from "./LandingSection"

const GuardAgainstPhishingAttack = (): JSX.Element => (
  <LandingSection
    title="Guard against phishing attack"
    photo={
      <Flex justifyContent="end">
        <Box position="relative" width="full">
          <Img
            w="full"
            src="/landing/guild-guard.png"
            alt="Guard against phishing attack"
          />

          <Img
            display={{ base: "none", lg: "block" }}
            position="absolute"
            left={-24}
            bottom={-4}
            maxW="30%"
            src="/landing/robot.svg"
            alt="Guild Guard Robot"
          />

          <Img
            position="absolute"
            right={{ base: -4, lg: -8 }}
            top={{ base: "auto", md: 4 }}
            bottom={{ base: 2, md: "auto" }}
            maxW="30%"
            src="/landing/reka-eth.png"
            alt="Brunya"
          />
        </Box>
      </Flex>
    }
    content={
      <Text w="full" fontSize="xl" fontWeight="medium" lineHeight="125%">
        Protect your community <br />
        against Discord scams. <br />
        Web3 captcha to filter <br />
        bad-actor bots.
      </Text>
    }
  />
)

export default GuardAgainstPhishingAttack
