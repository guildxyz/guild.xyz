"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { useColorMode } from "@chakra-ui/react"
import { useTheme } from "next-themes"
import { PiDesktop } from "react-icons/pi"
import { PiMoon } from "react-icons/pi"
import { PiSun } from "react-icons/pi"
import { useIsClient } from "usehooks-ts"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const isClient = useIsClient()
  const { colorMode: chakraColorMode, setColorMode: setChakraColorMode } =
    useColorMode()

  if (!isClient) {
    return
  }

  return (
    <ToggleGroup
      type="single"
      value={chakraColorMode || theme}
      onValueChange={(selected) => {
        if (selected) {
          setTheme(selected)
          if (typeof setChakraColorMode === "function") setChakraColorMode(selected)
        }
      }}
      aria-label="Toggle between themes"
    >
      <ToggleGroupItem
        value="light"
        aria-label="Toggle light mode"
        size="icon"
        variant="primary"
        className="size-8"
      >
        <PiSun weight="bold" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Toggle dark mode"
        size="icon"
        variant="primary"
        className="size-8"
      >
        <PiMoon weight="bold" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        aria-label="Toggle system default"
        size="icon"
        variant="primary"
        className="size-8"
      >
        <PiDesktop weight="bold" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
