import useGuild from "components/[guild]/hooks/useGuild"
import fetcher from "utils/fetcher"
import { SignedValidation, useSubmitWithSign } from "./useSubmit"

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

  const createSnapshotFetcher = (signedValidation: SignedValidation) =>
    fetcher(endpoint, {
      method: "POST",
      ...signedValidation,
    })

  return useSubmitWithSign(createSnapshotFetcher, { onSuccess, onError })
}

export default useCreateSnapshot
