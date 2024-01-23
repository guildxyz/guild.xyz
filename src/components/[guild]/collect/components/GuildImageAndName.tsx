import { HStack } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import GuildLogo from "components/common/GuildLogo"
import Link from "components/common/Link"

const GuildImageAndName = () => {
  const { name, urlName, imageUrl } = useGuild()
  const { textColor } = useThemeContext()

  return (
    <HStack>
      <GuildLogo imageUrl={imageUrl} size={8} />
      <Link
        href={`/${urlName}`}
        fontFamily="display"
        fontWeight="bold"
        color={textColor}
      >
        {name}
      </Link>
    </HStack>
  )
}
export default GuildImageAndName
