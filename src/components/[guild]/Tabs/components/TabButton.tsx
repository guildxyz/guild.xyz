import { useThemeContext } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import Link from "next/link"
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

  return (
    <Button
      {...(href && {
        as: Link,
        href,
        prefetch: false,
      })}
      {...(!isStuck && {
        color: textColor,
        colorScheme: buttonColorScheme,
      })}
      variant="ghost"
      isActive={isActive}
      mx={isActive && 2}
      sx={{
        /**
         * This equals to :first-child, just changed it so we don't get the annoying
         * emotion error in the console:
         * https://github.com/emotion-js/emotion/issues/2917#issuecomment-1791940421
         */
        ":not(:not(:last-child) ~ *)": {
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
    </Button>
  )
}

export default TabButton
