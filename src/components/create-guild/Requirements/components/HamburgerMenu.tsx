import { Flex, Img } from "@chakra-ui/react"

const HamburgerMenu = (): JSX.Element => (
  <Flex
    alignItems="center"
    justifyContent="center"
    position="absolute"
    right={4}
    top={4}
    ml={{ base: -6, md: 0 }}
    boxSize={30}
    borderColor="white"
  >
    <Img src={`/flavorLogos/hamburgerMenu.svg`} boxSize={30} />
  </Flex>
)

export default HamburgerMenu
