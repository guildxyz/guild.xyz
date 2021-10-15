import { Text } from "@chakra-ui/react"
import DotDelimiter from "components/common/DotDelimiter"
import Link from "components/common/Link"

const Footer = () => (
  <Text
    mt={16}
    pb={{ base: 20, md: 8 }}
    textAlign="center"
    colorScheme="gray"
    lineHeight={2}
  >
    {`This website is `}
    <Link
      href="https://github.com/AgoraSpaceDAO/guild.xyz"
      isExternal
      colorScheme="green"
    >
      open-source
    </Link>
    <DotDelimiter wrap />
    <Link href="https://twitter.com/guildxyz" isExternal colorScheme="TWITTER">
      Twitter
    </Link>
    <DotDelimiter />
    <Link href="https://discord.gg/bryPA3peuT" isExternal colorScheme="DISCORD">
      Discord
    </Link>
  </Text>
)

export default Footer
