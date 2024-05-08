import {
  ColorModeWithSystem,
  SimpleGrid,
  useColorMode,
  useRadioGroup,
} from "@chakra-ui/react"
import useLocalStorage from "hooks/useLocalStorage"
import dynamic from "next/dynamic"
import { Moon, Sun } from "phosphor-react"
import { useEffect } from "react"

/**
 * Have to import dynamically only on client, otherwise there's a mismatch in
 * classNames and the states are glitching
 */
const ThemeOption = dynamic(() => import("./ThemeOption"), {
  ssr: false,
})

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
  const { setColorMode } = useColorMode()
  const [local, setLocal] = useLocalStorage("chakra-ui-color-mode", undefined)

  /**
   * Chakra doesn't support a true automatic mode right now. If there's no
   * localStorage value, it sets the correct one (because of `initialColorMode:
   * "system"` in theme config), but also writes it to localStorage, so it's not
   * automatic anymore. As a workaround, we're removing the automatically set value
   * on mount in that case with this setTimeout, so it stays automatic. It's really
   * hacky and there're edge cases, but that's the best we can do right now.
   *
   * Also it doesn't update if the system color mode changes while the page is open:
   * it would if we'd set useSystemColorMode to true in the theme config, but it'd
   * also if the user has choosen a mode manually, so it's better to keep that false
   */
  useEffect(() => {
    if (local === undefined)
      setTimeout(() => {
        window.localStorage.removeItem("chakra-ui-color-mode")
      }, 3000)
  }, [local])

  const { getRootProps, getRadioProps } = useRadioGroup({
    onChange: (newValue: ColorModeWithSystem) => {
      setColorMode(newValue)
      setLocal(newValue === "system" ? undefined : newValue)
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
