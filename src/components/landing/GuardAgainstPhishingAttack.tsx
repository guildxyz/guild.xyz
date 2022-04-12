import { Box, Flex, Img } from "@chakra-ui/react"
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
            position="absolute"
            right={{ base: -4, lg: -16 }}
            top={{ base: "auto", md: 8 }}
            bottom={{ base: 2, md: "auto" }}
            maxW="30%"
            src="/landing/brunya.png"
            alt="Brunya"
          />
        </Box>
      </Flex>
    }
    content={`Protect your community \nagainst Discord scams. \nWeb3 captcha to filter \nbad-actor bots.`}
  />
)

export default GuardAgainstPhishingAttack
