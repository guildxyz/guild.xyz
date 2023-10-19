import LinkButton from "components/common/LinkButton"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { useRouter } from "next/router"
import { ArrowLeft } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  href?: string
}

const BackButton = ({ href, children }: PropsWithChildren<Props>) => {
  const router: any = useRouter()
  const hasNavigated = router.components && Object.keys(router.components).length > 2

  const colorContext = useThemeContext()

  if (!hasNavigated) return null

  return (
    <LinkButton
      href={href ?? "/explorer"}
      variant="link"
      color={colorContext?.textColor}
      opacity={0.75}
      size="sm"
      leftIcon={<ArrowLeft />}
      alignSelf="flex-start"
      mb="6"
    >
      {children ?? "Go back to explorer"}
    </LinkButton>
  )
}

export default BackButton
