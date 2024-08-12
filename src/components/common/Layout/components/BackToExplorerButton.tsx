import { useThemeContext } from "components/[guild]/ThemeContext"
import { useRouter } from "next/router"
import { BackButton } from "./BackButton"

const BackToExplorerButton = () => {
  const router: any = useRouter()
  const hasNavigated = router.components && Object.keys(router.components).length > 2

  const colorContext = useThemeContext()

  if (!hasNavigated) return null

  return <BackButton href="/explorer">Go back to explorer</BackButton>
}

export { BackToExplorerButton }
