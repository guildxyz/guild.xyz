import { Flex, Img } from "@chakra-ui/react"

const FlavorIcon = (): JSX.Element => (
  <Flex
    alignItems="center"
    justifyContent="center"
    position="absolute"
    left={0}
    top={-14}
    ml={0}
    boxSize={184}
    borderColor="gray.800"
  >
    <Img src={`/flavorLogos/flavorLogo.svg`} boxSize={184} />
  </Flex>
)

export default FlavorIcon
