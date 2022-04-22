import { Box, Flex, Img } from "@chakra-ui/react"
import LandingSection from "./LandingSection"

const RealTimeQueryEngine = (): JSX.Element => (
  <LandingSection
    flipped
    title="Real-time query engine"
    photo={
      <Flex justifyContent="end">
        <Box position="relative" width="full">
          <Img
            width="full"
            src="/landing/real-time-query-engine.png"
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
    content={`1M+ tokens, 100K+ NFT \nprojects and 10+ chains are available. \nSearch, pick and \nbuild on it.`}
  />
)

export default RealTimeQueryEngine
