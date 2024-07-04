import useUser from "components/[guild]/hooks/useUser"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { User } from "types"

export default function useFetchUserEmail() {
  const { id } = useUser()
  const fetcherWithSign = useFetcherWithSign()

  return (): Promise<User["emails"]> =>
    fetcherWithSign([`/v2/users/${id}/emails`, { method: "GET" }])
      .then(([{ address = null, createdAt = null }] = []) => ({
        emailAddress: address,
        pending: false,
        createdAt,
      }))
      .catch(() => null)
}
