import { NULL_ADDRESS } from "./guildCheckout/constants"

// Fallback to NULL_ADDRESS, to avoid unexpected issues when not passing a proper hex string to this function
const shortenHex = (hex: string = NULL_ADDRESS, length = 4): string =>
  `${hex.substring(0, length + (hex.startsWith("0x") ? 2 : 0))}…${hex.substring(
    hex.length - length
  )}`

export default shortenHex
