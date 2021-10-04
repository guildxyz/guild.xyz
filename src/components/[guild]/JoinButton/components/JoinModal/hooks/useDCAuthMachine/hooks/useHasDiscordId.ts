import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"

const fetchHasDiscordId = (_, account): Promise<boolean> =>
  fetch(`${process.env.NEXT_PUBLIC_API}/user/isMember`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      platform: "DISCORD",
      address: account,
    }),
  }).then((response) => (response.ok ? response.json() : false))

const useHasDiscordId = (): boolean => {
  const { account } = useWeb3React()

  const shouldFetch = !!account

  const { data } = useSWRImmutable(
    shouldFetch ? ["hasDCid", account] : null,
    fetchHasDiscordId
  )

  return data
}

export default useHasDiscordId
