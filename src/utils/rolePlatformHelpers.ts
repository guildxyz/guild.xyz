import { getTimeDiff } from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import { RolePlatform, RolePlatformStatus } from "types"

export const getRolePlatformStatus = (
  rolePlatform: RolePlatform
): RolePlatformStatus => {
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const startTimeDiff = getTimeDiff(rolePlatform?.startTime)
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const endTimeDiff = getTimeDiff(rolePlatform?.endTime)

  if (
    typeof rolePlatform?.capacity === "number" &&
    rolePlatform?.capacity === rolePlatform?.claimedCount
  ) {
    return "ALL_CLAIMED"
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
  } else if (startTimeDiff > 0) {
    return "NOT_STARTED"
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
  } else if (endTimeDiff < 0) {
    return "ENDED"
  } else {
    return "ACTIVE"
  }
}

export const getRolePlatformTimeframeInfo = (rolePlatform: RolePlatform) => {
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const startTimeDiff = getTimeDiff(rolePlatform?.startTime) ?? 0
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const endTimeDiff = getTimeDiff(rolePlatform?.endTime) ?? 0

  const isAvailable =
    startTimeDiff <= 0 && // Start time is now or in the past
    endTimeDiff >= 0 && // End time is in the future
    (typeof rolePlatform?.capacity !== "number" ||
      rolePlatform?.capacity !== rolePlatform?.claimedCount) // Capacity not reached

  return { isAvailable, startTimeDiff, endTimeDiff }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getRolePlatformStatus, getRolePlatformTimeframeInfo }
