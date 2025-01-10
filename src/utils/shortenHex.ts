import { NULL_ADDRESS } from "./guildCheckout/constants"

// Fallback to NULL_ADDRESS, to avoid unexpected issues when not passing a proper hex string to this function
const shortenHex = (hexRaw: string, length = 4): string => {
  const hex = hexRaw || NULL_ADDRESS
  return `${hex.substring(0, length + (hex.startsWith("0x") ? 2 : 0))}…${hex.substring(
    hex.length - length
  )}`
}

export default shortenHex
