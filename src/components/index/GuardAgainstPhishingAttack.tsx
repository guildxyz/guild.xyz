import { Box, Flex, Img, Text, VStack } from "@chakra-ui/react"
import Button from "components/common/Button"
import Link from "components/common/Link"
import LandingSection from "./LandingSection"

const GuardAgainstPhishingAttack = (): JSX.Element => (
  <LandingSection
    title="Guard against phishing attacks"
    photo={
      <Flex justifyContent="end">
        <Box position="relative" width="full">
          <Img
            w="full"
            src="/landing/guild-guard.png"
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
            src="/landing/reka-eth.png"
            alt="Brunya"
          />
        </Box>
      </Flex>
    }
    content={
      <VStack w="full" spacing={8} alignItems={{ base: "center", md: "start" }}>
        <Text fontSize="xl" fontWeight="medium" lineHeight="125%">
          Protect your community <br />
          against Discord scams. <br />
          Web3 captcha to filter <br />
          bad-actor bots and <br />
          protect your community <br />
          against Discord scams
        </Text>

        <Link
          href="https://guard.guild.xyz"
          target="_blank"
          _hover={{
            textDecoration: "none",
          }}
        >
          <Button
            colorScheme="DISCORD"
            px={{ base: 4, "2xl": 6 }}
            h={{ base: 12, "2xl": 14 }}
            fontFamily="display"
            fontWeight="bold"
            letterSpacing="wide"
            lineHeight="base"
          >
            Learn more
          </Button>
        </Link>
      </VStack>
    }
  />
)

export default GuardAgainstPhishingAttack
