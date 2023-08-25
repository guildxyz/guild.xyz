import { useMemo } from "react"
import { PlatformName } from "types"
import useAccess from "./useAccess"

const usePlatformsToReconnect = () => {
  const {
    data: { requirementErrors, roleAccesses },
  } = useAccess()

  const platformsToReconnect = useMemo(() => {
    if (!roleAccesses) {
      return []
    }

    return [
      ...new Set<PlatformName>(
        requirementErrors
          ?.filter(({ errorType }) => errorType === "PLATFORM_CONNECT_INVALID")
          .map(({ subType }) => subType?.toUpperCase() as PlatformName)
      ),
    ]
  }, [roleAccesses, requirementErrors])

  return platformsToReconnect
}

export default usePlatformsToReconnect
