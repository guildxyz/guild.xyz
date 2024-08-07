import { ButtonProps, IconButton } from "@chakra-ui/react"
import { SlidersHorizontal } from "@phosphor-icons/react"
import { useRouter } from "next/router"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"

const EditGuildButton = (props: ButtonProps): JSX.Element => {
  const router = useRouter()
  const { urlName } = useGuild()
  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <IconButton
      icon={<SlidersHorizontal />}
      aria-label="Edit Guild"
      colorScheme={buttonColorScheme}
      color={textColor}
      onClick={() => router.push(`/${urlName}/dashboard`)}
      {...props}
    />
  )
}

export default EditGuildButton
