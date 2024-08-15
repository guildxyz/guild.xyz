import { getTimeDiff } from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import { RolePlatform, RolePlatformStatus } from "types"

export const getRolePlatformStatus = (
  rolePlatform: RolePlatform | ReturnType<typeof useRolePlatform>
): RolePlatformStatus => {
  const startTimeDiff = getTimeDiff(rolePlatform?.startTime)
  const endTimeDiff = getTimeDiff(rolePlatform?.endTime)

  if (
    typeof rolePlatform?.capacity === "number" &&
    rolePlatform?.capacity === rolePlatform?.claimedCount
  ) {
    return "ALL_CLAIMED"
  } else if (startTimeDiff > 0) {
    return "NOT_STARTED"
  } else if (endTimeDiff < 0) {
    return "ENDED"
  } else {
    return "ACTIVE"
  }
}

export const getRolePlatformTimeframeInfo = (
  rolePlatform: RolePlatform | ReturnType<typeof useRolePlatform>
) => {
  const startTimeDiff = getTimeDiff(rolePlatform?.startTime) ?? 0
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
