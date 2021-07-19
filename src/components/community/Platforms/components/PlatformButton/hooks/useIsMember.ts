import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { useCommunity } from "components/community/Context"

const fetchIsMember = async (
  url: string,
  address: string,
  platform: string,
  communityId: number
) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      platform,
      communityId,
    }),
  })
    .then((response) => response.json())
    .then((data) => (typeof data === "boolean" ? data : false))

const useIsMember = (platform: string): boolean => {
  const { account } = useWeb3React()
  const { id: communityId } = useCommunity()

  const shouldFetch = !!account && !!communityId

  const { data } = useSWR(
    shouldFetch
      ? [
          `${process.env.NEXT_PUBLIC_API}/user/isMember`,
          account,
          platform,
          communityId,
        ]
      : null,
    fetchIsMember
  )

  return data
}

export default useIsMember
