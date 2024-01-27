import { getTimeDiff } from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import { RolePlatform, RolePlatformStatus } from "types"

export const getRolePlatformStatus = (
  rolePlatform: RolePlatform
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

export const isRolePlatformInActiveTimeframe = (
  rolePlatform: RolePlatform,
  additionalCondition = true
) => {
  const startTimeDiff = getTimeDiff(rolePlatform?.startTime)
  const endTimeDiff = getTimeDiff(rolePlatform?.endTime)

  const inActiveTimeframe =
    (startTimeDiff > 0 ||
      endTimeDiff < 0 ||
      (typeof rolePlatform?.capacity === "number" &&
        rolePlatform?.capacity === rolePlatform?.claimedCount)) &&
    additionalCondition

  return { inActiveTimeframe, startTimeDiff, endTimeDiff }
}

export default { getRolePlatformStatus, isRolePlatformInActiveTimeframe }
