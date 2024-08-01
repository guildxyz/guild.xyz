"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { useColorMode } from "@chakra-ui/react"
import { Desktop, Moon, Sun } from "@phosphor-icons/react/dist/ssr"
import { useTheme } from "next-themes"
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
      size="icon"
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
        className="size-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <Sun weight="bold" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="dark"
        aria-label="Toggle dark mode"
        className="size-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <Moon weight="bold" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="system"
        aria-label="Toggle system default"
        className="size-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <Desktop weight="bold" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
