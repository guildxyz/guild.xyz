import { PlatformName } from "@guildxyz/types"

export const modalSizeForPlatform = (platform: PlatformName) => {
  switch (platform) {
    case "ERC20":
    case "POINTS":
      return "xl"
    case "UNIQUE_TEXT":
    case "TEXT":
      return "2xl"
    case "POAP":
      return "lg"
    case "TELEGRAM":
      return "md"
    case "CONTRACT_CALL":
      return "4xl"
    default:
      return "3xl"
  }
}
