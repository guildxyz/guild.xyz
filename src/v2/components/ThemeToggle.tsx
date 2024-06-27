"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { Desktop, Moon, Sun } from "@phosphor-icons/react"
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
        size="sm"
        variant="primary"
      >
        <Sun />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Toggle dark mode"
        size="sm"
        variant="primary"
      >
        <Moon />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        aria-label="Toggle system default"
        size="sm"
        variant="primary"
      >
        <Desktop />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
