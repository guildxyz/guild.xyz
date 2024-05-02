import useGuild from "components/[guild]/hooks/useGuild"
import useSWRWithOptionalAuth from "./useSWRWithOptionalAuth"

export type Snapshot = {
  id: number
  name: string
  guildId: number
  guildPlatformId: number
  createdAt: string
  data?: any
}

const useSnapshot = (guildPlatformId: number, snapshotId: number) => {
  const { id: guildId } = useGuild()

  const endpoint =
    guildPlatformId && snapshotId
      ? `/v2/guilds/${guildId}/points/${guildPlatformId}/snapshots/${snapshotId}`
      : null
  const {
    data: snapshot,
    isLoading: isSnapshotLoading,
    error,
  } = useSWRWithOptionalAuth(endpoint)

  return { snapshot, isSnapshotLoading, error }
}

const useSnapshots = (guildPlatformId: number) => {
  const { id: guildId } = useGuild()

  const endpoint = !!guildPlatformId
    ? `/v2/guilds/${guildId}/points/${guildPlatformId}/snapshots`
    : null
  const {
    data: snapshots,
    isLoading,
    error,
    mutate,
  } = useSWRWithOptionalAuth(endpoint)

  return { snapshots: snapshots, isLoading, error, mutate }
}

export { useSnapshot, useSnapshots }
