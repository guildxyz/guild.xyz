import { Box, Flex, Img, VStack } from "@chakra-ui/react"
import { ArrowSquareOut } from "phosphor-react"
import LandingButton from "./LandingButton"
import LandingSection from "./LandingSection"
import LandingSectionText from "./LandingSectionText"

const GuardAgainstPhishingAttack = (): JSX.Element => (
  <LandingSection
    title="Guard against phishing attacks"
    media={
      <Flex justifyContent="end">
        <Box position="relative" width="full">
          <Img
            w="full"
            src="/landing/guild-guard.webp"
            alt="Guard against phishing attacks"
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
            src="/landing/reka-eth.webp"
            alt="Brunya"
          />
        </Box>
      </Flex>
    }
    content={
      <VStack w="full" spacing={8} alignItems={{ base: "center", md: "start" }}>
        <LandingSectionText>
          Web3 captcha to filter bad-actor bots and protect your community against
          Discord scams.
        </LandingSectionText>

        <LandingButton
          as="a"
          href="https://guard.guild.xyz"
          target="_blank"
          rightIcon={<ArrowSquareOut />}
        >
          Learn more
        </LandingButton>
      </VStack>
    }
  />
)

export default GuardAgainstPhishingAttack
