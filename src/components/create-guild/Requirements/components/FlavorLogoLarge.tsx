import { Flex, Img } from "@chakra-ui/react"

const FlavorIcon = (boxSize): JSX.Element => (
  <Flex
    alignItems="center"
    justifyContent="center"
    position="absolute"
    // left={0}
    top={-100}
    ml={0}
    boxSize={510}
    borderColor="gray.800"
  >
    <Img src={`/flavorLogos/flavorLogoLarge.svg`} boxSize={510} />
  </Flex>
)

export default FlavorIcon
