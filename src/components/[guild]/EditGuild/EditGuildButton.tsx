import { IconButton } from "@chakra-ui/react"
import { GearSix } from "@phosphor-icons/react"
import { useRouter } from "next/router"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"

const EditGuildButton = (): JSX.Element => {
  const router = useRouter()
  const { urlName } = useGuild()
  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <IconButton
      icon={<GearSix />}
      aria-label="Edit Guild"
      minW={"44px"}
      rounded="full"
      colorScheme={buttonColorScheme}
      color={textColor}
      onClick={() => router.push(`/${urlName}/dashboard`)}
      ml="auto"
    />
  )
}

export default EditGuildButton
