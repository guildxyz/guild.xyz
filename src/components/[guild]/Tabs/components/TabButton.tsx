import { useThemeContext } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import LinkButton from "components/common/LinkButton"
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
  isActive,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext() ?? {
    textColor: "white",
    buttonColorScheme: "whiteAlpha",
  }

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
      mx={isActive && 2}
      sx={{
        ":first-child": {
          ml: 0,
        },
        ":last-child": {
          mr: 0,
        },
      }}
      minW="max-content"
      {...rest}
    >
      {children}
    </Component>
  )
}

export default TabButton
