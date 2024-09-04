import { useUserPublic } from "@/hooks/useUserPublic"
import { useCallback } from "react"

const getKeyForSWRWithOptionalAuth = (url: string, userId: number | undefined) => {
  if (!userId) return null
  return [url, { method: "GET" }, `swr-with-optional-auth-${userId}`] as const
}

const useGetKeyForSWRWithOptionalAuth = () => {
  const { id, keyPair } = useUserPublic()

  return useCallback(
    (url: string) => {
      if (!keyPair) return null
      return getKeyForSWRWithOptionalAuth(url, id)
    },
    [id, keyPair]
  )
}

export { useGetKeyForSWRWithOptionalAuth }
