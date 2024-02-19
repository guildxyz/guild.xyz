import { Schemas } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"

const useUserSubmission = (form: Schemas["Form"]) => {
  const { id } = useUser()
  const fetcherWithSign = useFetcherWithSign()

  return useSWRImmutable(
    !!form && !!id
      ? [
          `/v2/guilds/${form.guildId}/forms/${form.id}/user-submissions/${id}`,
          { method: "GET", body: {} },
        ]
      : null,
    fetcherWithSign,
    {
      shouldRetryOnError: false,
    }
  )
}

export default useUserSubmission
