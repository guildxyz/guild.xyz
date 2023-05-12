import {
  ColorModeWithSystem,
  SimpleGrid,
  useColorMode,
  useRadioGroup,
} from "@chakra-ui/react"
import useLocalStorage from "hooks/useLocalStorage"
import { Moon, Sun } from "phosphor-react"
import ThemeOption from "./ThemeOption"

const options = [
  {
    label: <Sun />,
    value: "light",
  },
  {
    label: <Moon />,
    value: "dark",
  },
  {
    label: "auto",
    value: "system",
  },
]

const ThemeSwitcher = () => {
  const { setColorMode, colorMode } = useColorMode()
  const [local, setLocal] = useLocalStorage("chakra-ui-color-mode", colorMode)

  const { getRootProps, getRadioProps } = useRadioGroup({
    onChange: (newValue: ColorModeWithSystem) => {
      setLocal(newValue === "system" ? undefined : newValue)
      setColorMode(newValue)
    },
    value: local ?? "system",
  })

  const group = getRootProps()

  return (
    <SimpleGrid {...group} columns={3} gap={2}>
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value })
        return <ThemeOption key={option.value} {...radio} {...option} />
      })}
    </SimpleGrid>
  )
}

export default ThemeSwitcher
