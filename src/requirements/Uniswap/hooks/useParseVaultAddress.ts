import { useMemo } from "react"
import { useWatch } from "react-hook-form"

// Note: We might want to put these kind of constants to `@guildxyz/types/consts`
export const ADDRESS_REGEX = /0x[0-9a-f]{40}/i

export function useParseVaultAddress(baseFieldPath: string) {
  const lpVaultInputValue = useWatch({ name: `${baseFieldPath}.data.lpVault` })

  const lpVaultAddress = useMemo(() => {
    if (!lpVaultInputValue || typeof lpVaultInputValue !== "string") return null
    const [match] = lpVaultInputValue.match(ADDRESS_REGEX) || []
    if (!match) return null
    return match as `0x${string}`
  }, [lpVaultInputValue])

  return lpVaultAddress
}
