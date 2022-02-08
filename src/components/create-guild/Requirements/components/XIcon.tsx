import { Flex, Img } from "@chakra-ui/react"

const XIcon = (): JSX.Element => (
  <Flex
    alignItems="center"
    justifyContent="center"
    position="absolute"
    // left={{ base: "50%", md: -150 }}
    right={2}
    top={2}
    ml={{ base: -6, md: 0 }}
    // boxSize={14}
    borderColor="gray.800"
  >
    <Img src={`/flavorLogos/x-icon.svg`}  />
  </Flex>
)

export default XIcon
