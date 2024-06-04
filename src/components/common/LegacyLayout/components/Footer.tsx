import { Link } from "@chakra-ui/next-js"
import { Box, Icon, Text } from "@chakra-ui/react"
import { ArrowSquareOut } from "phosphor-react"

const Footer = (): JSX.Element => (
  <Box as="footer" mt="auto" py="6">
    <Text textAlign="center" fontSize={"sm"}>
      <Text as="span" colorScheme="gray" lineHeight={2}>
        {`This website is `}
      </Text>
      <Link href="https://github.com/guildxyz/guild.xyz" isExternal>
        open-source
        <Icon as={ArrowSquareOut} ml="1" />
      </Link>
      <Text as="span" colorScheme="gray" lineHeight={2}>
        {` and built on the `}
      </Text>
      <Link href="https://www.npmjs.com/package/@guildxyz/sdk" isExternal>
        Guild SDK
        <Icon as={ArrowSquareOut} ml="1" />
      </Link>
    </Text>
  </Box>
)

export default Footer
