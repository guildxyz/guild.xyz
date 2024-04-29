import useGuild from "components/[guild]/hooks/useGuild"
import { useEffect, useMemo, useState } from "react"
import fetcher from "utils/fetcher"
import useSWRWithOptionalAuth from "./useSWRWithOptionalAuth"
import { SignedValidation, useSubmitWithSign } from "./useSubmit"

const usePollUntilDone = (guildPlatformId: number, snapshotId: number) => {
  const { id: guildId } = useGuild()

  const [pollInterval, setPollInterval] = useState(1000)

  const endpoint =
    guildPlatformId &&
    snapshotId &&
    `/v2/guilds/${guildId}/points/${guildPlatformId}/snapshots/${snapshotId}`

  const { data, error, mutate, isLoading } = useSWRWithOptionalAuth(endpoint, {
    refreshInterval: pollInterval,
    onSuccess: (res: any) => {
      if (res.status === "DONE") {
        mutate(res, false)
        setPollInterval(null)
      }
    },
  })

  const done = useMemo(() => data?.status === "DONE", [data])

  return { data, isLoading, done, error }
}

const useCreateSnapshot = ({
  guildPlatformId,
  onSuccess,
  onError,
}: {
  guildPlatformId: number
  onSuccess: (res) => void
  onError: (err) => void
}) => {
  const { id: guildId } = useGuild()
  const endpoint = `/v2/guilds/${guildId}/points/${guildPlatformId}/snapshots`

  const [createdSnapshotId, setCreatedSnaphotId] = useState(null)

  const {
    data: createdSnapshot,
    isLoading: snapshotIsLoading,
    done,
    error: pollError,
  } = usePollUntilDone(guildPlatformId, createdSnapshotId)

  useEffect(() => {
    if (!!createdSnapshot && done) {
      onSuccess(createdSnapshotId)

      return () => {
        setCreatedSnaphotId(null)
      }
    }
  }, [createdSnapshot, done, createdSnapshotId, onSuccess, setCreatedSnaphotId])

  const createSnapshotFetcher = (signedValidation: SignedValidation) =>
    fetcher(endpoint, {
      method: "POST",
      ...signedValidation,
    })

  const {
    onSubmit,
    isLoading: createIsLoading,
    error: createError,
  } = useSubmitWithSign(createSnapshotFetcher, {
    onSuccess: (res) => {
      setCreatedSnaphotId(res.id)
    },
    onError: (err) => onError(err),
  })

  return {
    onSubmit: onSubmit,
    isLoading: createIsLoading || snapshotIsLoading || (!!createdSnapshot && !done),
    error: createError || pollError,
  }
}

export default useCreateSnapshot
