import { IconButton } from "@chakra-ui/react"
import { SlidersHorizontal } from "@phosphor-icons/react"
import { useRouter } from "next/router"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"

const EditGuildButton = (): JSX.Element => {
  const router = useRouter()
  const { urlName } = useGuild()
  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <IconButton
      icon={<SlidersHorizontal />}
      aria-label="Edit Guild"
      w={10}
      h={10}
      colorScheme={buttonColorScheme}
      color={textColor}
      onClick={() => router.push(`/${urlName}/dashboard`)}
    />
  )
}

export default EditGuildButton
