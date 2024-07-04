"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { Desktop, Moon, Sun } from "@phosphor-icons/react/dist/ssr"
import { useTheme } from "next-themes"
import { useIsClient } from "usehooks-ts"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const isClient = useIsClient()

  if (!isClient) {
    return
  }

  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={(selected) => {
        if (selected) setTheme(selected)
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
        <Sun weight="bold" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Toggle dark mode"
        size="icon"
        variant="primary"
        className="size-8"
      >
        <Moon weight="bold" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        aria-label="Toggle system default"
        size="icon"
        variant="primary"
        className="size-8"
      >
        <Desktop weight="bold" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
