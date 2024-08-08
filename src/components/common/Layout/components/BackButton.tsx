import { ArrowLeft } from "@phosphor-icons/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import Link from "next/link"
import { PropsWithChildren } from "react"

type Props = {
  href?: string
}

const BackButton = ({ href, children }: PropsWithChildren<Props>) => {
  const { urlName } = useGuild()
  const themeContext = useThemeContext()

  return (
    <Button
      as={Link}
      href={href ?? `/${urlName}`}
      variant="link"
      color={themeContext?.textColor}
      opacity={0.75}
      size="sm"
      leftIcon={<ArrowLeft />}
      alignSelf="flex-start"
    >
      {children ?? "Back to guild page"}
    </Button>
  )
}
export { BackButton }
