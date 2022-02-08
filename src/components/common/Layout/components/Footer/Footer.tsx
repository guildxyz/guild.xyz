import { Center, Container, Flex, Link } from "@chakra-ui/react"
import GithubIcon from "components/create-guild/Requirements/components/GithubIcon"
import TwitterIcon from "components/create-guild/Requirements/components/TwitterIcon"

const Footer = (): JSX.Element => (
  <Flex as="footer" /* bg="blackAlpha.200" */ mt="auto" pb="6">
    <Container>
      <Center justifyContent="center" alignItems="center">
        <Link
          target="_blank"
          href="https://github.com/Cult-of-Flavor"
          bgColor="#ffffff"
        >
          <GithubIcon />
        </Link>

        <Link target="_blank" href="https://twitter.com/0xFlavor">
          <TwitterIcon />
        </Link>
      </Center>
    </Container>
  </Flex>
)

export default Footer
