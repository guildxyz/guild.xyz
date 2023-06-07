import { useMemo } from "react"
import { PlatformName } from "types"
import useAccess from "./useAccess"

const usePlatformsToReconnect = () => {
  const { data: accesses } = useAccess()

  const platformsToReconnect = useMemo(() => {
    if (!accesses) {
      return []
    }

    return [
      ...new Set<PlatformName>(
        (accesses ?? [])
          ?.flatMap(({ errors }) => errors ?? [])
          .filter(({ errorType }) => errorType === "PLATFORM_CONNECT_INVALID")
          .map(({ subType }) => subType?.toUpperCase())
      ),
    ]
  }, [accesses])

  return platformsToReconnect
}

export default usePlatformsToReconnect
