import { useColorMode, IconButton, Icon } from "@chakra-ui/react"
import Card from "components/common/Card"
import { Moon, Sun } from "phosphor-react"

const ColorModeSwitch = (): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Card>
      <IconButton
        aria-label="Switch color mode"
        variant="ghost"
        borderRadius="2xl"
        icon={
          colorMode === "light" ? (
            <Icon as={Moon} weight="fill" />
          ) : (
            <Icon as={Sun} weight="fill" />
          )
        }
        onClick={toggleColorMode}
      />
    </Card>
  )
}

export default ColorModeSwitch
