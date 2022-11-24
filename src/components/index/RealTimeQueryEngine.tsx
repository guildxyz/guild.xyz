import { Box, Flex, Img } from "@chakra-ui/react"
import LandingSection from "./LandingSection"
import LandingSectionText from "./LandingSectionText"

const RealTimeQueryEngine = (): JSX.Element => (
  <LandingSection
    flipped
    title="Real-time query engine"
    media={
      <Flex justifyContent="end">
        <Box position="relative" width="full">
          <Img
            width="full"
            src="/landing/real-time-query-engine.webp"
            alt="Guard against phishing attack"
          />

          <Img
            position="absolute"
            left={-1}
            bottom={-4}
            w="calc(100% + 2rem)"
            maxW="none"
            src="/landing/unicorn.svg"
            alt="Unicorn"
          />
        </Box>
      </Flex>
    }
    content={
      <LandingSectionText>
        Guild operates with its own indexer. 1M+ tokens, 100K+ NFT projects and 10+
        chains are available. Search, pick and build on it.
      </LandingSectionText>
    }
  />
)

export default RealTimeQueryEngine
