import { Icon, IconButton, useColorMode } from "@chakra-ui/react"
import { Moon, Sun } from "phosphor-react"

const ColorModeSwitch = (): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label="Switch color mode"
      variant="ghost"
      isRound
      icon={
        colorMode === "light" ? (
          <Icon as={Moon} weight="fill" />
        ) : (
          <Icon as={Sun} weight="fill" />
        )
      }
      width={10}
      height={10}
      onClick={toggleColorMode}
    />
  )
}

export default ColorModeSwitch
