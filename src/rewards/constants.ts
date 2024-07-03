import type { PlatformName } from "types"

/**
 * "CONTRACT_CALL" is left out intentionally, because we store its capacity in the
 * contract, so it isn't handled the same way as other platforms with capacity/time
 */
export const CAPACITY_TIME_PLATFORMS: PlatformName[] = [
  "TEXT",
  "UNIQUE_TEXT",
  "POAP",
  "GATHER_TOWN",
  "ERC20",
] as const
