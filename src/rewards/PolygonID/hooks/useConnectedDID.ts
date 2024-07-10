import useUser from "components/[guild]/hooks/useUser"
import { env } from "env"
import useSWRImmutable from "swr/immutable"

const useConnectedDID = () => {
  const { id: userId } = useUser()

  return useSWRImmutable<string>(
    userId ? `${env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id` : null,
    {
      shouldRetryOnError: false,
    }
  )
}

export default useConnectedDID
