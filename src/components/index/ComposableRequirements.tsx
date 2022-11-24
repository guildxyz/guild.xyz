import { Box, Img } from "@chakra-ui/react"
import LandingSection from "./LandingSection"
import LandingSectionText from "./LandingSectionText"

const ComposableRequirements = (): JSX.Element => (
  <LandingSection
    title="Composable membership requirements"
    media={
      <Box position="relative" width="full">
        <Img
          width="full"
          src="/landing/composable-membership-requirements.webp"
          alt="Composable membership requirements"
          loading="lazy"
        />

        <Img
          position="absolute"
          left={-16}
          bottom={-16}
          width={{ base: "calc(100% + 6rem)", lg: "calc(100% + 10rem)" }}
          maxW="none"
          src="/landing/composable-membership-requirements-icons.webp"
          alt="Composable membership requirements - icons"
          loading="lazy"
        />
      </Box>
    }
    content={
      <LandingSectionText>
        Built-in integrations and external APIs to maximize your choices. Play with
        logic gates and cross-chain opportunities.
      </LandingSectionText>
    }
  />
)

export default ComposableRequirements
