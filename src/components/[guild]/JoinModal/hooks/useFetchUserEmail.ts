import useUser from "components/[guild]/hooks/useUser"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import { User } from "types"

export default function useFetchUserEmail() {
  const { id } = useUser()
  const fetcherWithSign = useFetcherWithSign()
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  return (): Promise<User["emails"]> =>
    fetcherWithSign(getKeyForSWRWithOptionalAuth(`/v2/users/${id}/emails`))
      .then(([{ address = null, createdAt = null }] = []) => ({
        emailAddress: address,
        pending: false,
        createdAt,
      }))
      .catch(() => null)
}
