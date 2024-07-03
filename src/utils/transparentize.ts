import { ThemeTypings } from "@chakra-ui/react"

/**
 * Transparentize Chakra UI color tokens
 *
 * @param color - Chakra UI (semantic) token
 * @param opacity - Opacity value 0 to 1.
 */
export const transparentize = (color: ThemeTypings["colors"], value: number) => {
  const key = color.replaceAll(".", "-")
  return `color-mix(in srgb, var(--chakra-colors-${key}) ${Math.max(
    Math.min(value * 100, 100),
    0
  )}%, transparent)`
}
