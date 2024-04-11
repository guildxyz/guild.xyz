import useGuild from "components/[guild]/hooks/useGuild"
import fetcher from "utils/fetcher"
import useSWRWithOptionalAuth from "./useSWRWithOptionalAuth"
import { SignedValidation, useSubmitWithSign } from "./useSubmit"

export type Snapshot = {
  id: number
  name: string
  guildId: number
  guildPlatformId: number
  createdAt: string
  data?: any
}

const snapshots: Snapshot[] = [
  {
    id: 0,
    name: "Mock Snapshot",
    guildId: 55463,
    guildPlatformId: 26839,
    createdAt: "2024. 04. 11. 10:25:09",
  },
  {
    id: 1,
    name: "Mock Snapshot 2",
    guildId: 55463,
    guildPlatformId: 26839,
    createdAt: "2024. 04. 11. 10:25:09",
  },
]

const useSnapshot = (snapshotId: number) => {
  const { id: guildId } = useGuild()

  // const endpoint = `v2/guilds/${guildId}/snapshots/${snapshotId}`
  // const {data: snapshot, isLoading: isSnapshotLoading, error} = useSWRWithOptionalAuth(endpoint)

  return { snapshot: snapshots[0], isSnapshotLoading: false, error: null }
}

const useSnapshots = (guildPlatformId: number) => {
  const { id: guildId } = useGuild()

  const endpoint = `/v2/guilds/${guildId}/points/${guildPlatformId}/snapshots`
  const {
    data: snapshots2,
    isLoading: isSnapshotsLoading,
    error,
  } = useSWRWithOptionalAuth(endpoint)

  console.log(snapshots2)

  return { snapshots: snapshots2, isSnapshotsLoading: false, error: null }
}

const useCreateSnapshot = (guildPlatformId: number) => {
  const { id: guildId } = useGuild()

  const endpoint = `/v2/guilds/${guildId}/points/${guildPlatformId}/snapshots`

  const createSnapshotFetcher = (signedValidation: SignedValidation) =>
    fetcher(endpoint, {
      method: "POST",
      ...signedValidation,
    })

  const { onSubmit } = useSubmitWithSign(createSnapshotFetcher, {
    onSuccess: (response) => {
      console.log(response)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  return { submitCreate: onSubmit }
}

export { useCreateSnapshot, useSnapshot, useSnapshots }
