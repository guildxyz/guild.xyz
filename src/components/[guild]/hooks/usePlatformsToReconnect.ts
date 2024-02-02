import useMembership from "components/explorer/hooks/useMemberships"
import { useMemo } from "react"
import { PlatformName } from "types"

const usePlatformsToReconnect = () => {
  const { membership } = useMembership()

  const platformsToReconnect = useMemo(() => {
    if (!membership) {
      return []
    }

    return [
      ...new Set<PlatformName>(
        (membership?.roles ?? [])
          ?.flatMap(({ requirements }) => requirements ?? [])
          .filter(({ errorType }) => errorType === "PLATFORM_CONNECT_INVALID")
          .map(({ subType }) => subType?.toUpperCase() as PlatformName)
      ),
    ]
  }, [membership])

  return platformsToReconnect
}

export default usePlatformsToReconnect
