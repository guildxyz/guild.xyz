import useGuild from "components/[guild]/hooks/useGuild"
import { useState } from "react"
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
    isLoading: isSnapshotsLoading,
    error,
    mutate,
  } = useSWRWithOptionalAuth(endpoint)

  return { snapshots: snapshots, isSnapshotsLoading: false, error: null, mutate }
}

const useCreateSnapshot = (guildPlatformId: number) => {
  const { id: guildId } = useGuild()

  const endpoint = `/v2/guilds/${guildId}/points/${guildPlatformId}/snapshots`

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const createSnapshotFetcher = (signedValidation: SignedValidation) =>
    fetcher(endpoint, {
      method: "POST",
      ...signedValidation,
    })

  const handleSubmit = (data?: unknown) => {
    setIsLoading(true)
    return onSubmit(data)
  }

  const { onSubmit } = useSubmitWithSign(createSnapshotFetcher, {
    onSuccess: (response) => {
      setIsLoading(false)
      return response
    },
    onError: (_error) => {
      setError(_error)
      setIsLoading(false)
    },
  })

  return { submitCreate: handleSubmit, isLoading, error }
}

export { useCreateSnapshot, useSnapshot, useSnapshots }
