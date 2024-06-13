import { Link } from "@chakra-ui/next-js"
import { HStack } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import GuildLogo from "components/common/GuildLogo"

const GuildImageAndName = () => {
  const { name, urlName, imageUrl } = useGuild()
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const { textColor } = useThemeContext()

  return (
    <HStack mb={3}>
      <GuildLogo
        imageUrl={imageUrl}
        size={6}
        bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
      />
      <Link
        href={`/${urlName}`}
        fontFamily="display"
        fontWeight="bold"
        color={textColor}
        opacity="0.7"
      >
        {name}
      </Link>
    </HStack>
  )
}
export default GuildImageAndName
