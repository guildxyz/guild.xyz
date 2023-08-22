import Button from "components/common/Button"
import LinkButton from "components/common/LinkButton"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { useRouter } from "next/router"
import { PropsWithChildren } from "react"
import { Rest } from "types"
import { useIsTabsStuck } from "../Tabs"

type Props = {
  href?: string
  disabled?: boolean
  tooltipText?: string
  isActive?: boolean
} & Rest

const TabButton = ({
  href,
  isActive: isActiveProp,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext() ?? {
    textColor: "white",
    buttonColorScheme: "whiteAlpha",
  }

  const router = useRouter()
  const path = router.asPath.split("?")[0]
  const isActive =
    typeof isActiveProp === "undefined"
      ? path?.split("#")?.[0] === href
      : isActiveProp

  const Component = href ? LinkButton : Button

  return (
    <Component
      href={href}
      colorScheme={"gray"}
      {...(!isStuck && {
        color: textColor,
        colorScheme: buttonColorScheme,
      })}
      variant="ghost"
      isActive={isActive}
      minW="max-content"
      {...rest}
    >
      {children}
    </Component>
  )
}

export default TabButton
