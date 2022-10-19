import { Box, Icon, Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"

const Footer = (): JSX.Element => (
  <Box as="footer" /* bg="blackAlpha.200" */ mt="auto" py="6">
    <Text textAlign="center" fontSize={"sm"}>
      <Text as="span" colorScheme="gray" lineHeight={2}>
        {`This website is `}
      </Text>
      <Link href="https://github.com/agoraxyz/guild.xyz" isExternal>
        open-source
        <Icon as={ArrowSquareOut} ml="1" />
      </Link>
    </Text>
  </Box>
)

export default Footer
